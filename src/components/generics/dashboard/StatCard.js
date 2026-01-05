import React from "react";

export const StatCard = ({ icon: Icon, title, value, change }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between h-full">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      {change && (
        <p
          className={`text-xs mt-1 ${
            change.includes("+") || change.includes("new")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {change}
        </p>
      )}
    </div>
    <div className="bg-orange-50 p-3 rounded-full">
      <Icon className="w-6 h-6 text-[#b5734c]" />
    </div>
  </div>
);
