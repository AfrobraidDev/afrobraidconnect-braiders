import React from 'react';

export const HelpCard = ({ icon: Icon, title, description }) => (
  <a href="#" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-start gap-3">
    <div className="bg-theme-primary/10 p-3 rounded-lg">
      <Icon className="w-6 h-6 text-theme-primary" />
    </div>
    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </a>
);