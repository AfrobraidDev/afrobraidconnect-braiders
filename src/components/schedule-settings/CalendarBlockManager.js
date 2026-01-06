"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  Trash2,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  startOfDay,
  endOfDay,
  areIntervalsOverlapping,
} from "date-fns";
import { useAvailabilityBlocks } from "../dashboard/hooks/useAvailabilityBlocks";
import { DateActionModal } from "./DateActionModal";

export const CalendarBlockManager = () => {
  const {
    blocks,
    deleteBlock,
    createBlock,
    setDailyAvailability,
    isCreatingBlock,
    isSettingDaily,
  } = useAvailabilityBlocks();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getBlocksForDay = (day) => {
    const dayInterval = { start: startOfDay(day), end: endOfDay(day) };

    return blocks.filter((block) => {
      const blockInterval = {
        start: parseISO(block.start_time),
        end: parseISO(block.end_time),
      };
      return areIntervalsOverlapping(dayInterval, blockInterval, {
        inclusive: true,
      });
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalIcon size={18} className="text-theme-primary" />
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-white">
          {calendarDays.map((day) => {
            const dayBlocks = getBlocksForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDate = isToday(day);
            const hasBlock = dayBlocks.length > 0;

            return (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                    min-h-[120px] p-2 border-b border-r border-gray-100 cursor-pointer relative group transition-all flex flex-col gap-1
                    ${
                      !isCurrentMonth
                        ? "bg-gray-50/30 text-gray-300"
                        : "bg-white"
                    }
                    hover:bg-gray-50
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`
                        text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                        ${
                          isTodayDate
                            ? "bg-theme-primary text-white"
                            : "text-gray-700"
                        }
                    `}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                {hasBlock &&
                  dayBlocks.slice(0, 3).map((block) => (
                    <div
                      key={block.id}
                      className={`
                                text-[10px] px-2 py-1 rounded-md truncate font-medium border
                                ${
                                  block.reason === "Outside Availability"
                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                    : "bg-red-50 text-red-700 border-red-100"
                                }
                            `}
                      title={block.reason}
                    >
                      {block.reason || "Blocked"}
                    </div>
                  ))}
                {hasBlock && dayBlocks.length > 3 && (
                  <div className="text-[10px] text-gray-400 pl-1">
                    +{dayBlocks.length - 3} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-gray-400" />
          Active Exceptions & Time Off
        </h3>
        {blocks.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No special blocks set. You are following your weekly schedule.
          </p>
        ) : (
          <div className="space-y-3">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      block.reason === "Outside Availability"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {block.reason === "Outside Availability" ? (
                      <Clock size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {block.reason}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(parseISO(block.start_time), "MMM d, h:mm a")} —{" "}
                      {format(parseISO(block.end_time), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBlock(block.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove Block"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedDate && (
        <DateActionModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onBlock={(data) => {
            createBlock(data);
            setSelectedDate(null);
          }}
          onSetDaily={(data) => {
            setDailyAvailability(data);
            setSelectedDate(null);
          }}
          isProcessing={isCreatingBlock || isSettingDaily}
        />
      )}
    </div>
  );
};
