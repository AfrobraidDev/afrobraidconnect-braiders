'use client';
import React, { useState } from 'react';

export const ActivityTabs = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const tabStyle = "px-4 py-2 text-sm font-semibold transition-colors";
  const activeTabStyle = "border-b-2 border-theme-primary text-theme-primary";
  const inactiveTabStyle = "text-gray-500 hover:text-gray-700";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`${tabStyle} ${activeTab === 'bookings' ? activeTabStyle : inactiveTabStyle}`}
        >
          Recent Bookings
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`${tabStyle} ${activeTab === 'messages' ? activeTabStyle : inactiveTabStyle}`}
        >
          New Messages <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">3</span>
        </button>
      </div>
      <div className="mt-4 space-y-4">
        {/* Mock data here. In a real app, this would be dynamic. */}
        {activeTab === 'bookings' ? (
          <>
            <div className="flex items-center hover:bg-gray-50 p-2 rounded-md">
              <p className="text-gray-700">Amaka Johnson - <span className="text-gray-500">Knotless Braids</span></p>
              <p className="ml-auto text-sm text-gray-400">Oct 14, 9:00 AM</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center hover:bg-gray-50 p-2 rounded-md">
              <div>
                <p className="font-semibold text-gray-800">Gift Emmanuel</p>
                <p className="text-sm text-gray-500 truncate">Hi, are you free this weekend for...</p>
              </div>
              <p className="ml-auto text-xs text-gray-400">10:45 AM</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};