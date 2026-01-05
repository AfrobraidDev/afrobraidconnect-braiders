"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  PlusCircle,
  Users,
  UserPlus,
  Repeat,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useClients } from "./hooks/useClients";
import { ClientStatCard } from "../generics/clients/StatCard";
import { ClientStatusBadge } from "../generics/clients/StatusBadge";
import { ClientDetailsModal } from "../generics/clients/DetailedModal";

export const ClientsScreen = () => {
  const {
    clients,
    stats,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalCount,
    isLoading,
  } = useClients();

  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "??";

  return (
    <>
      <main className="p-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ClientStatCard
            icon={Users}
            title="Total Clients"
            value={isLoading ? "..." : stats?.total_clients || 0}
            colorClass="bg-blue-500"
          />
          <ClientStatCard
            icon={UserPlus}
            title="New This Month"
            value={isLoading ? "..." : stats?.new_this_month || 0}
            colorClass="bg-green-500"
          />
          <ClientStatCard
            icon={Repeat}
            title="Returning Clients"
            value={isLoading ? "..." : stats?.returning_clients || 0}
            colorClass="bg-yellow-500"
          />
          <ClientStatCard
            icon={Send}
            title="Send Promo"
            value="Action"
            colorClass="bg-red-500"
          />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by client name..."
              value={searchTerm}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3 hidden md:table-cell text-center">
                        Total Bookings
                      </th>
                      <th className="px-6 py-3 hidden lg:table-cell">
                        Last Appointment
                      </th>
                      <th className="px-6 py-3 hidden md:table-cell">Status</th>
                      <th className="px-6 py-3">
                        <span className="sr-only">Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <tr
                          key={client.client_id}
                          className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleClientClick(client)}
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            <div className="flex items-center gap-3">
                              {client.profile_picture ? (
                                <Image
                                  src={client.profile_picture}
                                  alt={client.full_name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                  {getInitials(client.full_name)}
                                </div>
                              )}
                              <div>
                                {client.full_name}
                                <div className="text-gray-500 font-normal md:hidden text-xs">
                                  {client.total_bookings} bookings
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell text-center font-medium">
                            {client.total_bookings}
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            {client.last_appointment
                              ? new Date(
                                  client.last_appointment
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <ClientStatusBadge status={client.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="font-medium text-theme-primary hover:underline">
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No clients found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-medium text-gray-600 disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <span className="text-xs text-gray-500">
                  Page {page} • Total {totalCount}
                </span>
                <button
                  disabled={clients.length < 10}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-medium text-gray-600 disabled:opacity-50 hover:bg-gray-50"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <ClientDetailsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        client={selectedClient}
      />
    </>
  );
};
