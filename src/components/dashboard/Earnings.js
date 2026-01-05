"use client";
import React from "react";
import { DollarSign, Calendar, Clock, CheckCircle } from "lucide-react";
import { useEarnings } from "./hooks/useEarnings";
import { EarningStatCard } from "../generics/earnings/StatCard";
import { EarningsChart } from "../generics/earnings/Chart";
import { TransactionsTable } from "../generics/earnings/TransactionsTable";

export const EarningsScreen = () => {
  const { stats, graphData, transactions, insights, isLoading } = useEarnings();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount || 0);
  };

  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Earnings</h1>
        <p className="text-gray-500 mt-1">
          Track your income, payouts, and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <EarningStatCard
          icon={DollarSign}
          title="Total Earnings"
          value={isLoading ? "..." : formatCurrency(stats?.total_earnings)}
          colorClass="bg-green-500"
        />
        <EarningStatCard
          icon={Calendar}
          title="This Month"
          value={isLoading ? "..." : formatCurrency(stats?.earnings_this_month)}
          colorClass="bg-blue-500"
        />
        <EarningStatCard
          icon={Clock}
          title="Pending Payouts"
          value={isLoading ? "..." : formatCurrency(stats?.pending_payouts)}
          colorClass="bg-yellow-500"
        />
        <EarningStatCard
          icon={CheckCircle}
          title="Completed Bookings"
          value={isLoading ? "..." : stats?.completed_bookings_count || 0}
          colorClass="bg-theme-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <EarningsChart data={graphData} isLoading={isLoading} />
          <TransactionsTable
            transactions={transactions}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Payouts</h3>
            <div className="space-y-3 text-sm mb-5">
              <p className="flex justify-between">
                <span className="text-gray-500">Next Payout Date:</span>
                <span className="font-semibold text-gray-800">Nov 1, 2026</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Bank Details:</span>
                <span className="font-semibold text-gray-800">
                  GTBank - **** 1234
                </span>
              </p>
            </div>
            <button className="w-full bg-theme-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all shadow-sm">
              Request Payout
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Insights</h3>
            {isLoading ? (
              <div className="h-20 flex items-center justify-center text-gray-400 text-sm">
                Loading...
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Avg. Income / Booking</span>
                  <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {formatCurrency(insights?.avg_income_per_booking)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Top Earning Service</span>
                  <span className="font-bold text-gray-800">
                    {insights?.top_earning_service || "N/A"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
