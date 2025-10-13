'use client';
import React from 'react';
import { DollarSign, Calendar, Clock, CheckCircle } from 'lucide-react';

// Import generic components
import { EarningStatCard } from '../generics/earnings/StatCard';
import { EarningsChart } from '../generics/earnings/Chart';
import { TransactionsTable } from '../generics/earnings/TransactionsTable';

export const EarningsScreen = () => {
  return (
    <main className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Earnings</h1>
        <p className="text-gray-500 mt-1">Track your income, payouts, and performance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <EarningStatCard icon={DollarSign} title="Total Earnings" value="₦480,500" colorClass="bg-green-500" />
        <EarningStatCard icon={Calendar} title="This Month" value="₦150,500" colorClass="bg-blue-500" />
        <EarningStatCard icon={Clock} title="Pending Payouts" value="₦30,000" colorClass="bg-yellow-500" />
        <EarningStatCard icon={CheckCircle} title="Completed Bookings" value="28" colorClass="bg-theme-primary" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Chart and Transactions */}
        <div className="lg:col-span-2 space-y-8">
          <EarningsChart />
          <TransactionsTable />
        </div>

        {/* Right Column: Payouts and Insights */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Payouts</h3>
            <div className="space-y-3 text-sm mb-5">
              <p className="flex justify-between"><span>Next Payout Date:</span> <span className="font-semibold">Nov 1, 2025</span></p>
              <p className="flex justify-between"><span>Bank Details:</span> <span className="font-semibold">GTBank - **** 1234</span></p>
            </div>
            <button className="w-full bg-theme-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all">
              Request Payout
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Insights</h3>
            <div className="space-y-3 text-sm">
               <p className="flex justify-between"><span>Avg. Income / Booking:</span> <span className="font-semibold">₦21,500</span></p>
               <p className="flex justify-between"><span>Top Earning Service:</span> <span className="font-semibold">Knotless Braids</span></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};