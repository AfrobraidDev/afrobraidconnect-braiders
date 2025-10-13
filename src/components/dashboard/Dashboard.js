import React from 'react';
import { Wallet, Calendar, Users, MessageSquare } from 'lucide-react';
import { DashboardHeader, StatCard, NextAppointment, ActivityTabs, Reviews, QuickActions } from '../generics/dashboard';


export default function Dashboard() {
  return (
    <main className="p-4 md:p-8">
      <DashboardHeader />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Left Column (Main Content) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard icon={Wallet} title="Earnings (This Month)" value="₦150,500" change="+12.5%" />
            <StatCard icon={Calendar} title="Upcoming Appointments" value="8" change="2 new today" />
            <StatCard icon={Users} title="Total Clients" value="42" change="+3 new" />
            <StatCard icon={MessageSquare} title="Unread Messages" value="3" />
          </div>
          <ActivityTabs />
        </div>

        {/* --- Right Column (Side Content) --- */}
        <div className="lg:col-span-1 space-y-6">
          <NextAppointment />
          <Reviews />
          <QuickActions />
        </div>
      </div>
    </main>
  );
};