import React from 'react';
import { PlusCircle, User } from 'lucide-react';

export const QuickActions = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
    <button className="flex items-center justify-center w-full bg-theme-primary text-gray-800 font-bold py-3 px-4 hover:bg-opacity-90 transition-all shadow-sm">
      <PlusCircle className="w-5 h-5 mr-2" />
      Add New Service
    </button>
    <button className="flex items-center justify-center w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 hover:bg-gray-300 transition-all shadow-sm">
      <User className="w-5 h-5 mr-2" />
      Update Profile
    </button>
  </div>
);