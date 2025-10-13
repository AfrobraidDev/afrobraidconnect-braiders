import React from 'react';

export const StatCard = ({ icon: Icon, title, value, change }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {change && <p className="text-xs text-green-500 mt-1">{change}</p>}
    </div>
    <div className="bg-theme-primary/10 p-3 rounded-full">
      <Icon className="w-6 h-6 text-[#b5734c]" />
    </div>
  </div>
);