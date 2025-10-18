import React from 'react';
import Image from 'next/image';
import { X, Phone, Mail, MessageSquare, BookOpen, Repeat, BarChart3, Star, Edit2 } from 'lucide-react';
import { ClientStatusBadge } from './StatusBadge';

export const ClientDetailsModal = ({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
      <div className="bg-gray-50 h-full w-full max-w-lg shadow-xl relative animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
          <h3 className="text-lg font-bold text-gray-800">Client Profile</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Client Info */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <Image src={client.avatar} alt={client.name} width={500} height={500} className="w-20 h-20 rounded-full object-cover" />
            <div>
              <p className="text-xl font-semibold text-gray-900">{client.name}</p>
              <p className="text-gray-500 flex items-center gap-2 text-sm"><Phone size={14} /> {client.phone}</p>
              <p className="text-gray-500 flex items-center gap-2 text-sm"><Mail size={14} /> {client.email}</p>
            </div>
            <div className="ml-auto self-start"><ClientStatusBadge status={client.status} /></div>
          </div>

          {/* Spending Summary */}
          <div className="bg-white p-4 shadow-sm">
             <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><BarChart3 size={18} /> Spending Summary</h4>
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500">Total Spent</p><p className="font-semibold text-gray-800">{client.totalSpent}</p></div>
                <div><p className="text-gray-500">Total Bookings</p><p className="font-semibold text-gray-800">{client.totalBookings}</p></div>
                <div><p className="text-gray-500">Last Appointment</p><p className="font-semibold text-gray-800">{client.lastAppointment}</p></div>
                <div><p className="text-gray-500">Average Rating</p><p className="font-semibold text-gray-800 flex items-center gap-1">5.0 <Star size={14} className="text-yellow-400 fill-current" /></p></div>
             </div>
          </div>

          {/* Booking History */}
          <div className="bg-white p-4 shadow-sm">
            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><BookOpen size={18} /> Booking History</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {client.bookingHistory.map(booking => (
                <div key={booking.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-800">{booking.service}</p>
                    <p className="text-gray-500">{booking.date}</p>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-theme-primary font-semibold"><Repeat size={12} /> Book Again</button>
                </div>
              ))}
            </div>
          </div>

           {/* Notes */}
           <div className="bg-white p-4 shadow-sm">
            <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Edit2 size={18} /> Notes</h4>
            <p className="text-sm text-gray-600 italic">Prefers early morning appointments. Slightly tender-headed.</p>
           </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-white p-4 flex justify-end gap-3 border-t border-gray-300">
          <button className="px-4 py-2 bg-theme-primary text-white font-semibold hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm">
            <MessageSquare size={16} /> Message Client
          </button>
        </div>
      </div>
    </div>
  );
};