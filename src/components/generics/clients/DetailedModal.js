import React from "react";
import Image from "next/image";
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  BookOpen,
  Repeat,
  BarChart3,
  Star,
  Edit2,
} from "lucide-react";
import { ClientStatusBadge } from "./StatusBadge";

export const ClientDetailsModal = ({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null;

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "??";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-sm">
      <div className="bg-gray-50 h-full w-full max-w-lg shadow-xl relative animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h3 className="text-lg font-bold text-gray-800">Client Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            {client.profile_picture ? (
              <Image
                src={client.profile_picture}
                alt={client.full_name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-2xl">
                {getInitials(client.full_name)}
              </div>
            )}

            <div className="flex-1">
              <p className="text-xl font-semibold text-gray-900">
                {client.full_name}
              </p>
              <p className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                <Phone size={14} /> {client.phone || "N/A"}
              </p>
              <p className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                <Mail size={14} /> {client.email || "N/A"}
              </p>
            </div>
            <div className="self-start">
              <ClientStatusBadge status={client.status} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <BarChart3 size={18} /> Spending Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Bookings</p>
                <p className="font-semibold text-gray-800">
                  {client.total_bookings}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Appointment</p>
                <p className="font-semibold text-gray-800">
                  {client.last_appointment
                    ? new Date(client.last_appointment).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Total Spent</p>
                <p className="font-semibold text-gray-800">
                  ₦{client.total_spent || "0.00"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Rating</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  5.0{" "}
                  <Star size={14} className="text-yellow-400 fill-current" />
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <BookOpen size={18} /> Booking History
            </h4>

            {client.bookingHistory && client.bookingHistory.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {client.bookingHistory.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {booking.service}
                      </p>
                      <p className="text-gray-500">{booking.date}</p>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-theme-primary font-semibold">
                      <Repeat size={12} /> Book Again
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Booking history not available in quick view.
              </p>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Edit2 size={18} /> Notes
            </h4>
            <p className="text-sm text-gray-600 italic">
              {client.notes || "No notes added for this client."}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 flex justify-end gap-3 border-t">
          <button className="px-4 py-2 bg-theme-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm">
            <MessageSquare size={16} /> Message Client
          </button>
        </div>
      </div>
    </div>
  );
};
