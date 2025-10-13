import React from 'react';

export const ClientStatCard = ({ icon: Icon, title, value, colorClass }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
      <p className="text-sm font-medium text-gray-500">{title}</p>
    </div>
  </div>
);