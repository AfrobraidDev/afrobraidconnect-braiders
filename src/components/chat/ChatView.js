"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Send, Loader2, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { useChat } from "./useChat";

export default function ChatView({ bookingId }) {
  const { data: session } = useSession();
  const bottomRef = useRef(null);
  const [input, setInput] = useState("");

  const { messages, isLoading, isConnected, sendMessage, markAsRead } = useChat(
    bookingId,
    session?.accessToken,
    session?.user?.id
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!messages.length || !isConnected) return;

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage.is_me) {
      markAsRead();
    }
  }, [messages, isConnected, markAsRead]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;
    sendMessage(input);
    setInput("");
  };

  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
        <Loader2 className="w-8 h-8 text-[#b5734c] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="font-bold text-gray-900">Booking Chat</h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-500">
              {isConnected ? "Online" : "Connecting..."}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex w-full ${
              msg.is_me ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex flex-col max-w-[75%] ${
                msg.is_me ? "items-end" : "items-start"
              }`}
            >
              {!msg.is_me && (
                <span className="text-[10px] text-gray-400 mb-1 ml-2">
                  {msg.sender_name || "User"}
                </span>
              )}

              <div
                className={`
                  px-4 py-2.5 text-sm rounded-2xl shadow-sm
                  ${
                    msg.is_me
                      ? "bg-[#b5734c] text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }
                `}
              >
                {msg.content}
              </div>

              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] text-gray-400">
                  {msg.timestamp
                    ? format(new Date(msg.timestamp), "h:mm a")
                    : ""}
                </span>

                {msg.is_me && (
                  <span
                    className={msg.is_read ? "text-blue-500" : "text-gray-400"}
                  >
                    <CheckCheck size={14} />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
          className="flex-1 px-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-gray-200 border rounded-xl focus:outline-none transition-all text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || !isConnected}
          className="p-2.5 bg-[#b5734c] hover:bg-[#a06543] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
