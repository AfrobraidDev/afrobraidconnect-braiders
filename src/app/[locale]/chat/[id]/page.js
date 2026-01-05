"use client";

import ChatView from "@/components/chat/ChatView";
import { usePathname } from "next/navigation";

export default function BookingDetailPage() {
  const pathname = usePathname();
  const bookingId = pathname.split("/").pop(); // Extract bookingId from URL

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
      <ChatView bookingId={bookingId} />
    </div>
  );
}
