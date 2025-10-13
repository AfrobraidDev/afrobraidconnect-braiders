import React from 'react';
import { MessageSquare } from 'lucide-react';

export const LiveChatButton = () => (
  <button className="fixed bottom-8 right-8 bg-theme-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 z-40">
    <MessageSquare size={24} />
    <span className="sr-only">Chat with us</span>
  </button>
);