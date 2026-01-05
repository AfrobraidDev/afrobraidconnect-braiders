"use client";
import React, { useState } from "react";
import {
  Search,
  CalendarClock,
  BadgeCheck,
  XCircle,
  ChevronDown,
  Calendar,
  Filter,
} from "lucide-react";
import { useBookings } from "./hooks/useBookings";
import { BookingStatCard } from "../generics/bookings/StatCard";
import { BookingDetailsModal } from "../generics/bookings/DetailsModal";
import { BookingsTable } from "../generics/bookings/BookingsTable";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Refunded", value: "REFUNDED" },
  { label: "Declined", value: "DECLINED" },
];

export const BookingsScreen = () => {
  const {
    bookings,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    page,
    setPage,
    totalCount,
    isLoading,
  } = useBookings();

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  return (
    <>
      <main className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
            <p className="text-gray-500">Manage your appointments here.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BookingStatCard
            icon={CalendarClock}
            title="Upcoming"
            value={stats?.upcoming_bookings || 0}
            colorClass="bg-blue-500"
          />
          <BookingStatCard
            icon={BadgeCheck}
            title="Completed"
            value={stats?.completed_bookings || 0}
            colorClass="bg-green-500"
          />
          <BookingStatCard
            icon={XCircle}
            title="Cancelled"
            value={stats?.canceled_bookings || 0}
            colorClass="bg-red-500"
          />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search client name..."
                value={searchTerm}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-48">
                <select
                  className="w-full appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:bg-white focus:border-gray-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-gray-100 border-gray-400"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  End Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center bg-white rounded-xl shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
          </div>
        ) : (
          <>
            <BookingsTable
              bookings={bookings}
              onRowClick={handleBookingClick}
            />

            <div className="flex justify-between items-center mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} • Total {totalCount}
              </span>
              <button
                disabled={bookings.length < 10}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>

      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        booking={selectedBooking}
      />
    </>
  );
};
