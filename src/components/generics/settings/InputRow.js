import React from 'react';

export const InputRow = ({ label, type = 'text', id, placeholder, defaultValue, icon: Icon }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 items-center">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative col-span-2 mt-1 md:mt-0">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-theme-primary/50 focus:border-theme-primary ${Icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);