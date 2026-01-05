import React from "react";

export const EarningStatCard = ({ icon: Icon, title, value, colorClass }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);
