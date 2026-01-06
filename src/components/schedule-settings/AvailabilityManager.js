"use client";
import React, { useState } from "react";
import { Calendar, Repeat } from "lucide-react";
import AvailabilitySettings from "../onboarding/AvailabilitySettings";
import { CalendarBlockManager } from "./CalendarBlockManager";

export const AvailabilityManager = () => {
  const [viewMode, setViewMode] = useState("WEEKLY");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div className="bg-gray-100 p-1 rounded-xl flex items-center w-full sm:w-auto self-start">
          <button
            onClick={() => setViewMode("WEEKLY")}
            className={`
                    flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                    ${
                      viewMode === "WEEKLY"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }
                `}
          >
            <Repeat size={16} /> Weekly
          </button>
          <button
            onClick={() => setViewMode("CALENDAR")}
            className={`
                    flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                    ${
                      viewMode === "CALENDAR"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }
                `}
          >
            <Calendar size={16} /> Specific Dates
          </button>
        </div>
      </div>

      <div className="min-h-[500px]">
        {viewMode === "WEEKLY" ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <AvailabilitySettings />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CalendarBlockManager />
          </div>
        )}
      </div>
    </div>
  );
};
