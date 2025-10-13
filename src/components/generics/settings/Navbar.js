import React from 'react';

// You can keep the icons or remove them for a cleaner look. I'll keep them here.
import { User, Shield, Briefcase, Link, Eye, AlertTriangle } from 'lucide-react';

const navItems = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Shield },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'social', label: 'Social Links', icon: Link },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

export const SettingsNav = ({ activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    {/* This container enables horizontal scrolling on small screens */}
    <div className="flex space-x-4 overflow-x-auto pb-px -mb-px">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center gap-2 whitespace-nowrap px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === item.id 
              ? 'border-theme-primary text-theme-primary' 
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          <item.icon size={16} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  </div>
);