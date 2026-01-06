"use client";

import React from "react";
import { Wallet, Calendar, Users, MessageSquare } from "lucide-react";
import {
  DashboardHeader,
  StatCard,
  NextAppointment,
  ActivityTabs,
} from "../generics/dashboard";
import { useDashboard } from "./hooks/useDashboard";

export default function Dashboard() {
  const { stats, nextAppointment, recentBookings, messages, isLoading } =
    useDashboard();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount || 0);
  };

  return (
    <main className="p-4 md:p-8">
      <DashboardHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              icon={Wallet}
              title="Earnings (This Month)"
              value={
                isLoading ? "..." : formatCurrency(stats?.earnings?.amount)
              }
              change={
                stats?.earnings?.percentage_change
                  ? `${stats.earnings.is_increase ? "+" : "-"}${
                      stats.earnings.percentage_change
                    }%`
                  : null
              }
            />
            <StatCard
              icon={Calendar}
              title="Upcoming Appointments"
              value={
                isLoading ? "..." : stats?.appointments?.total_upcoming || 0
              }
              change={
                stats?.appointments?.new_today > 0
                  ? `${stats.appointments.new_today} new today`
                  : "No new bookings"
              }
            />
            <StatCard
              icon={Users}
              title="Total Clients"
              value={isLoading ? "..." : stats?.clients?.total_all_time || 0}
              change={
                stats?.clients?.new_today > 0
                  ? `+${stats.clients.new_today} new`
                  : null
              }
            />
            <StatCard
              icon={MessageSquare}
              title="Unread Messages"
              value={isLoading ? "..." : stats?.messages?.unread_count || 0}
            />
          </div>
          <ActivityTabs bookings={recentBookings} messages={messages} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <NextAppointment appointment={nextAppointment} />
        </div>
      </div>
    </main>
  );
}
