"use client";
import React, { useState } from "react";

export const ActivityTabs = ({ bookings = [], messages = [] }) => {
  const [activeTab, setActiveTab] = useState("bookings");

  const tabStyle = "px-4 py-2 text-sm font-semibold transition-colors";
  const activeTabStyle = "border-b-2 border-theme-primary text-theme-primary";
  const inactiveTabStyle = "text-gray-500 hover:text-gray-700";

  const unreadCount = messages.reduce(
    (acc, msg) => acc + (msg.unread_count || 0),
    0
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`${tabStyle} ${
            activeTab === "bookings" ? activeTabStyle : inactiveTabStyle
          }`}
        >
          Recent Bookings
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`${tabStyle} ${
            activeTab === "messages" ? activeTabStyle : inactiveTabStyle
          }`}
        >
          New Messages
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {activeTab === "bookings" ? (
          bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center hover:bg-gray-50 p-2 rounded-md transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <p className="text-gray-700 font-medium">
                    {booking.client_name}
                    <span className="text-gray-400 font-normal mx-2">|</span>
                    <span className="text-gray-500 font-normal text-sm">
                      {booking.service_name}
                    </span>
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {booking.invoice_number}
                    </span>
                  </div>
                </div>
                <p className="ml-auto text-sm text-gray-400 whitespace-nowrap">
                  {new Date(booking.start_time).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm p-2">
              No recent bookings found.
            </p>
          )
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-center hover:bg-gray-50 p-2 rounded-md transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">
                  {msg.other_party_name || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {msg.last_message}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-400">
                  {new Date(msg.last_message_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {msg.unread_count > 0 && (
                  <span className="inline-block w-2 h-2 bg-theme-primary rounded-full mt-1"></span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm p-2">No recent messages.</p>
        )}
      </div>
    </div>
  );
};
