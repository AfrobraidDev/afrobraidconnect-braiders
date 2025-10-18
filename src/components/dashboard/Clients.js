'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, PlusCircle, Users, UserPlus, Repeat, Send } from 'lucide-react';
import { ClientStatCard } from '../generics/clients/StatCard';
import { ClientStatusBadge } from '../generics/clients/StatusBadge';
import { ClientDetailsModal } from '../generics/clients/DetailedModal';

// --- Mock Data ---
const mockClients = [
  { id: 1, name: 'Adaeze Okafor', avatar: '/images/customer2.jpg', phone: '08012345678', email: 'ada@example.com', totalBookings: 6, lastAppointment: 'Sep 29, 2025', totalSpent: '₦75,000', status: 'Active', bookingHistory: [{id: 1, service: 'Knotless Braids', date: 'Sep 29, 2025'}]},
  { id: 2, name: 'Bisi Adekunle', avatar: '/images/customerphoto.jpg', phone: '08012345678', email: 'bisi@example.com', totalBookings: 1, lastAppointment: 'Oct 10, 2025', totalSpent: '₦15,000', status: 'New', bookingHistory: [{id: 1, service: 'Stitch Lines', date: 'Oct 10, 2025'}]},
  { id: 3, name: 'Ngozi Eze', avatar: '/images/customer2.jpg', phone: '08012345678', email: 'ngozi@example.com', totalBookings: 3, lastAppointment: 'Jun 15, 2025', totalSpent: '₦45,000', status: 'Inactive', bookingHistory: [{id: 1, service: 'Box Braids', date: 'Jun 15, 2025'}]},
];

export const ClientsScreen = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  
  const handleClientClick = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  return (
    <>
      <main className="p-4 md:p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Clients</h1>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ClientStatCard icon={Users} title="Total Clients" value="42" colorClass="bg-blue-500" />
          <ClientStatCard icon={UserPlus} title="New This Month" value="3" colorClass="bg-green-500" />
          <ClientStatCard icon={Repeat} title="Returning Clients" value="12" colorClass="bg-yellow-500" />
          <ClientStatCard icon={Send} title="Send Promo" value="Action" colorClass="bg-red-500" />
        </div>

        {/* Controls */}
        <div className="bg-white p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by client name or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-[#b5734c] focus:border-[#b5734c] focus:outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-gray-400 font-normal py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-all shadow-sm">
            <PlusCircle size={20} />
            Add Client
          </button>
        </div>

        {/* Client List */}
        <div className="bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3 hidden md:table-cell">Total Bookings</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Last Appointment</th>
                  <th className="px-6 py-3 hidden md:table-cell">Status</th>
                  <th className="px-6 py-3"><span className="sr-only">Details</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id} className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer" onClick={() => handleClientClick(client)}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <Image src={client.avatar} alt={client.name} width={500} height={500} className="w-10 h-10 rounded-full object-cover"/>
                        <div>
                          {client.name}
                          <div className="text-gray-500 font-normal md:hidden">{client.totalBookings} bookings</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-center font-medium">{client.totalBookings}</td>
                    <td className="px-6 py-4 hidden lg:table-cell">{client.lastAppointment}</td>
                    <td className="px-6 py-4 hidden md:table-cell"><ClientStatusBadge status={client.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button className="font-medium text-theme-primary hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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