import React from 'react';

export const SettingsSection = ({ title, description, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="border-b pb-4 mb-4">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);