import React from 'react';
import Image from 'next/image';
import { X, Phone, MessageSquare, Check, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const BookingDetailsModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Booking Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client Info */}
          <div className="flex items-center gap-4">
            <Image src={booking.client.avatar} alt={booking.client.name} width={500} height={500}  className="w-16 h-16 rounded-full object-cover" />
            <div>
              <p className="text-xl font-semibold text-gray-900">{booking.client.name}</p>
              <p className="text-gray-500 flex items-center gap-2"><Phone size={14} /> {booking.client.phone}</p>
            </div>
            <div className="ml-auto">
              <StatusBadge status={booking.status} />
            </div>
          </div>

          {/* Service & Appointment Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Service</p>
              <p className="font-semibold text-gray-800">{booking.service}</p>
            </div>
            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-semibold text-gray-800">{booking.price}</p>
            </div>
            <div>
              <p className="text-gray-500">Date & Time</p>
              <p className="font-semibold text-gray-800">{booking.date}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-semibold text-gray-800">{booking.location}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 p-4 flex justify-end gap-3 rounded-b-2xl">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2">
            <MessageSquare size={16} /> Message
          </button>
          {booking.status === 'Pending' && (
            <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
              <Check size={16} /> Accept
            </button>
          )}
          {booking.status !== 'Cancelled' && (
            <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
              <Trash2 size={16} /> Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};