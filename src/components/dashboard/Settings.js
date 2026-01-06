"use client";
import React, { useState } from "react";
import { User, Lock, ShieldAlert, CalendarClock, Loader2 } from "lucide-react";
import { useSettings } from "./hooks/useSettings";

import { GeneralProfileForm } from "../generics/settings/GeneralProfileForm";
import { SecurityForm } from "../generics/settings/SecurityForm";
import { AccountActions } from "../generics/settings/AccountActions";
import { AvailabilityManager } from "../schedule-settings/AvailabilityManager";

const TABS = [
  { id: "profile", label: "General Profile", icon: User },
  { id: "availability", label: "Availability", icon: CalendarClock },
  { id: "security", label: "Password & Security", icon: Lock },
  {
    id: "account",
    label: "Account Management",
    icon: ShieldAlert,
    danger: true,
  },
];

export const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { profile, loadingProfile } = useSettings();

  if (loadingProfile) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-theme-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8 max-w-8xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your business profile and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <nav className="lg:w-64 flex-shrink-0 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all
                  ${
                    isActive
                      ? "bg-theme-primary text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                  ${
                    tab.danger && !isActive
                      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                      : ""
                  }
                `}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {activeTab === "profile" && (
              <GeneralProfileForm profile={profile} />
            )}
            {activeTab === "availability" && <AvailabilityManager />}
            {activeTab === "security" && <SecurityForm />}
            {activeTab === "account" && <AccountActions profile={profile} />}
          </div>
        </div>
      </div>
    </main>
  );
};
