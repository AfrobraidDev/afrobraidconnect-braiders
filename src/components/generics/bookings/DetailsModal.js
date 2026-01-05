import React from "react";
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  Check,
  Trash2,
  Calendar,
  FileText,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";

const getInitials = (name) =>
  name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

export const BookingDetailsModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative animate-fade-in-up overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Booking Details</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FileText size={12} /> Invoice: {booking.invoice_number || "N/A"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary font-bold text-2xl">
              {getInitials(booking.customer_name)}
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold text-gray-900">
                {booking.customer_name}
              </p>
              <div className="text-sm text-gray-500 space-y-1 mt-1">
                <p className="flex items-center gap-2">
                  <Phone size={14} /> {booking.customer_phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} /> {booking.customer_email}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={booking.status} />
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  booking.is_paid
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {booking.is_paid ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>

          <hr />
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                Service
              </p>
              <p className="font-semibold text-gray-800 text-base">
                {booking.skill_name}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                Total Price
              </p>
              <p className="font-semibold text-gray-800 text-base">
                €{booking.total_price}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                Date & Time
              </p>
              <p className="font-semibold text-gray-800 flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <Calendar size={16} className="text-theme-primary" />
                {new Date(booking.appointment_date).toLocaleString([], {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <MessageSquare size={16} /> Chat
          </button>

          {booking.status === "PENDING" && (
            <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm">
              <Check size={16} /> Accept
            </button>
          )}

          {["PENDING", "CONFIRMED"].includes(booking.status) && (
            <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 font-semibold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2">
              <Trash2 size={16} /> Decline
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
