import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiController } from "@/utils/apiController";

const getWebSocketUrl = (endpoint, params = {}) => {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  const cleanHost = apiBase.replace(/^https?:\/\//, "");
  const protocol = apiBase.startsWith("https") ? "wss:" : "ws:";
  const queryString = new URLSearchParams(params).toString();
  return `${protocol}//${cleanHost}${endpoint}?${queryString}`;
};

export const useChat = (bookingId, token, currentUserId) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  // 1. Fetch History
  const { data: historyData, isLoading } = useQuery({
    queryKey: ["chatHistory", bookingId],
    queryFn: () =>
      apiController({
        method: "GET",
        url: `/chat/history/${bookingId}/`,
        requiresAuth: true,
        token: token,
      }),
    enabled: !!bookingId && !!token,
  });

  // 2. Sync History
  useEffect(() => {
    const results = historyData?.data?.results;
    if (results && Array.isArray(results)) {
      const chronological = [...results].reverse();
      setMessages(chronological);
    }
  }, [historyData]);

  // ✅ 3. Mark As Read Mutation
  const markReadMutation = useMutation({
    mutationFn: async () => {
      return apiController({
        method: "POST",
        url: `/chat/mark-read/${bookingId}/`, // Ensure trailing slash if Django requires it
        requiresAuth: true,
        token: token,
      });
    },
    // We don't need to do anything on success here;
    // the backend will send a WebSocket event to the *other* user.
  });

  // 4. WebSocket Connection
  useEffect(() => {
    if (!bookingId || !token) return;

    const wsUrl = getWebSocketUrl(`/ws/chat/${bookingId}/`, { token });
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => setIsConnected(true);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // ✅ CASE A: Read Receipt Event
        if (data.type === "read_receipt") {
          // If the *other* person read the chat, mark MY messages as read
          if (data.reader_id !== currentUserId) {
            setMessages((prev) =>
              prev.map((msg) => (msg.is_me ? { ...msg, is_read: true } : msg))
            );
          }
          return;
        }

        // ✅ CASE B: Incoming Message
        if (currentUserId && data.sender_id === currentUserId) return; // Ignore echo

        const newMessage = {
          id: Date.now(),
          content: data.message,
          sender_name: data.sender_name,
          sender_id: data.sender_id,
          timestamp: new Date().toISOString(),
          is_me: false,
          is_read: false, // Incoming messages are initially unread
        };

        setMessages((prev) => [...prev, newMessage]);
      } catch (e) {
        console.error("WS Parse Error", e);
      }
    };

    socket.onclose = () => setIsConnected(false);
    return () => socket.close();
  }, [bookingId, token, currentUserId]);

  // 5. Send Message
  const sendMessage = useCallback((content) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: content }));

      const optimisticMsg = {
        id: Date.now(),
        content: content,
        sender_name: "Me",
        timestamp: new Date().toISOString(),
        is_me: true,
        is_sending: false,
        is_read: false, // Default to grey ticks
      };
      setMessages((prev) => [...prev, optimisticMsg]);
    }
  }, []);

  return {
    messages,
    isLoading,
    isConnected,
    sendMessage,
    markAsRead: markReadMutation.mutate, // ✅ Expose the function
  };
};
