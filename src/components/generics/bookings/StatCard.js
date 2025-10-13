import React from 'react';

export const BookingStatCard = ({ icon: Icon, title, value, colorClass }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-full ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm font-medium text-gray-500">{title}</p>
    </div>
  </div>
);