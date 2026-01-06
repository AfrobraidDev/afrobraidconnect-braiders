import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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
  const [socketMessages, setSocketMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isHistoryLoading,
  } = useInfiniteQuery({
    queryKey: ["chatHistory", bookingId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiController({
        method: "GET",
        url: `/chat/history/${bookingId}/`,
        params: { page: pageParam },
        requiresAuth: true,
        token: token,
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next) return undefined;
      const url = new URL(lastPage.next);
      return url.searchParams.get("page");
    },
    enabled: !!bookingId && !!token,
    refetchOnWindowFocus: false,
  });

  const messages = useMemo(() => {
    const historyPages = data?.pages?.flatMap((page) => page.results) || [];

    const historyChronological = [...historyPages].reverse();

    const combined = [...historyChronological, ...socketMessages];

    const uniqueMap = new Map();
    combined.forEach((msg) => {
      uniqueMap.set(msg.id, msg);
    });

    return Array.from(uniqueMap.values());
  }, [data, socketMessages]);

  const markReadMutation = useMutation({
    mutationFn: async () => {
      return apiController({
        method: "POST",
        url: `/chat/mark-read/${bookingId}/`,
        requiresAuth: true,
        token: token,
      });
    },
  });

  useEffect(() => {
    if (!bookingId || !token) return;

    const wsUrl = getWebSocketUrl(`/ws/chat/${bookingId}/`, { token });
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => setIsConnected(true);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "read_receipt") {
          if (String(data.reader_id) !== String(currentUserId)) {
            setSocketMessages((prev) =>
              prev.map((msg) => (msg.is_me ? { ...msg, is_read: true } : msg))
            );
            queryClient.invalidateQueries(["chatHistory", bookingId]);
          }
          return;
        }

        if (currentUserId && String(data.sender_id) === String(currentUserId)) {
          return;
        }

        const newMessage = {
          id: data.id || Date.now(),
          content: data.message,
          sender_name: data.sender_name,
          sender_id: data.sender_id,
          timestamp: new Date().toISOString(),
          is_me: false,
          is_read: false,
        };

        setSocketMessages((prev) => [...prev, newMessage]);
      } catch (e) {
        console.error("WS Parse Error", e);
      }
    };

    socket.onclose = () => setIsConnected(false);
    return () => socket.close();
  }, [bookingId, token, currentUserId, queryClient]);

  const sendMessage = useCallback((content) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: content }));

      const optimisticMsg = {
        id: Date.now(),
        content: content,
        sender_name: "Me",
        timestamp: new Date().toISOString(),
        is_me: true,
        is_sending: true,
        is_read: false,
      };
      setSocketMessages((prev) => [...prev, optimisticMsg]);
    }
  }, []);

  return {
    messages,
    isLoading: isHistoryLoading,
    isConnected,
    sendMessage,
    markAsRead: markReadMutation.mutate,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
