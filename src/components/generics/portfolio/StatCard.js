import React from 'react';

export const PortfolioStatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
    <div className="bg-theme-primary/10 p-3 rounded-lg">
      <Icon className="w-5 h-5 text-theme-primary" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  </div>
);