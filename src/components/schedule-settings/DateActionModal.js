"use client";
import React, { useState, useRef } from "react";
import {
  X,
  Lock,
  ArrowRight,
  AlertTriangle,
  CalendarDays,
  Clock,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import Button from "@/components/generics/ui/Button";

const ModernDateTimePicker = ({
  label,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
}) => {
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  const displayDate = dateValue
    ? format(new Date(dateValue), "EEE, MMM d, yyyy")
    : "Select Date";

  let displayTime = "Select Time";
  if (timeValue) {
    const [hours, minutes] = timeValue.split(":");
    const dummyDate = new Date();
    dummyDate.setHours(parseInt(hours), parseInt(minutes));
    displayTime = format(dummyDate, "h:mm a");
  }

  const handleOpenPicker = (ref) => {
    try {
      if (ref.current && typeof ref.current.showPicker === "function") {
        ref.current.showPicker();
      } else if (ref.current) {
        ref.current.focus();
      }
    } catch (error) {
      console.log("Picker open error:", error);
    }
  };

  return (
    <div className="flex-1 min-w-[160px] group">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </label>

      <div className="flex gap-2 h-14">
        <div
          className="relative flex-grow bg-gray-50 hover:bg-white hover:shadow-md hover:border-red-200 border border-gray-200 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden"
          onClick={() => handleOpenPicker(dateInputRef)}
        >
          <input
            ref={dateInputRef}
            type="date"
            value={dateValue}
            onChange={onDateChange}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            tabIndex={-1}
          />

          <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
            <CalendarDays className="w-5 h-5 text-gray-400 mr-3 group-hover:text-red-500 transition-colors" />
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold text-gray-800 leading-tight">
                {displayDate}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                Date
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-300 ml-auto" />
          </div>
        </div>

        <div
          className="relative w-28 bg-gray-50 hover:bg-white hover:shadow-md hover:border-red-200 border border-gray-200 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden"
          onClick={() => handleOpenPicker(timeInputRef)}
        >
          <input
            ref={timeInputRef}
            type="time"
            value={timeValue}
            onChange={onTimeChange}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            tabIndex={-1}
          />

          <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
            <div className="flex flex-col justify-center w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800 leading-tight">
                  {displayTime}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-500 font-medium">
                  Time
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DateActionModal = ({ date, onClose, onBlock, isProcessing }) => {
  const [start, setStart] = useState({
    date: format(date, "yyyy-MM-dd"),
    time: "09:00",
  });

  const [end, setEnd] = useState({
    date: format(date, "yyyy-MM-dd"),
    time: "17:00",
  });

  const [reason, setReason] = useState("");

  const handleBlockTime = () => {
    const startISO = new Date(`${start.date}T${start.time}`).toISOString();
    const endISO = new Date(`${end.date}T${end.time}`).toISOString();

    onBlock({
      start_time: startISO,
      end_time: endISO,
      reason: reason || "Unavailable",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 flex flex-col max-h-[90vh]">
        <div className="relative bg-white p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600 shadow-sm">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Block Time Off
                </h3>
                <p className="text-sm text-gray-500">
                  Prevent clients from booking specific slots.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-8 bg-white">
          <div className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-white border border-orange-100 shadow-sm">
            <div className="p-2 bg-white rounded-full h-fit shadow-sm text-orange-500">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Note to Braider
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">
                Your profile will show as &quot;Busy&quot; for these times.
                Existing bookings will not be cancelled automatically.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 relative">
            <ModernDateTimePicker
              label="Start Date & Time"
              dateValue={start.date}
              timeValue={start.time}
              onDateChange={(e) => setStart({ ...start, date: e.target.value })}
              onTimeChange={(e) => setStart({ ...start, time: e.target.value })}
            />

            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[20%] text-gray-300 z-0">
              <ArrowRight size={24} />
            </div>

            <ModernDateTimePicker
              label="End Date & Time"
              dateValue={end.date}
              timeValue={end.time}
              onDateChange={(e) => setEnd({ ...end, date: e.target.value })}
              onTimeChange={(e) => setEnd({ ...end, time: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              Reason
            </label>
            <input
              type="text"
              placeholder="e.g. Vacation, Lunch Break..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 font-medium"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-gray-600 font-bold hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-sm"
          >
            Cancel
          </button>
          <Button
            onClick={handleBlockTime}
            isLoading={isProcessing}
            icon={Lock}
            className="w-full sm:w-auto !bg-red-600 hover:!bg-red-700 !text-white !rounded-xl !px-8 !py-3.5 shadow-lg shadow-red-600/20"
          >
            Confirm Block
          </Button>
        </div>
      </div>
    </div>
  );
};
