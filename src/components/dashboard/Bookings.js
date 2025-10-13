'use client';
import Image from 'next/image';
import React, { useState, useMemo } from 'react';
import { Search, PlusCircle, CalendarClock, Inbox, BadgeCheck, XCircle, ChevronDown } from 'lucide-react';

// Import the generic components
import { BookingStatCard } from '../generics/bookings/StatCard';
import { BookingDetailsModal } from '../generics/bookings/DetailsModal';
import { BookingsTable } from '../generics/bookings/BookingsTable';

// --- Mock Data (replace with API data in a real app) ---
const mockBookings = [
  { id: 1, client: { name: 'Amaka Johnson', avatar: '/images/customer2.jpg', phone: '08012345678' }, service: 'Knotless Braids', date: 'Oct 14, 2025 - 10:00 AM', location: 'Studio', price: '₦25,000', status: 'Confirmed' },
  { id: 2, client: { name: 'Chioma Nwosu', avatar: '/images/customerphoto.jpg', phone: '08012345678' }, service: 'Fulani Braids', date: 'Oct 15, 2025 - 12:30 PM', status: 'Pending', location: 'Home Service', price: '₦30,000' },
  { id: 3, client: { name: 'Teni Adebayo', avatar: '/images/customer2.jpg', phone: '08012345678' }, service: 'Stitch Lines', date: 'Oct 12, 2025 - 02:00 PM', status: 'Completed', location: 'Studio', price: '₦15,000' },
  { id: 4, client: { name: 'Fatima Bello', avatar: '/images/customerphoto.jpg', phone: '08012345678' }, service: 'Box Braids', date: 'Oct 11, 2025 - 09:00 AM', status: 'Cancelled', location: 'Studio', price: '₦20,000' },
  // ...add more mock bookings
];

// The Main Screen Component
export const BookingsScreen = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  // Memoize the filtered bookings to avoid re-calculation on every render
  const filteredBookings = useMemo(() => {
    return bookings
      .filter(booking => filterStatus === 'All' || booking.status === filterStatus)
      .filter(booking => booking.client.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [bookings, filterStatus, searchTerm]);

  return (
    <>
      <main className="p-4 md:p-8">
        {/* Screen Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
            <p className="text-gray-500">Manage your appointments here.</p>
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-gray-900 font-medium py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-all shadow-sm">
            <PlusCircle size={20} />
            Add Booking
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <BookingStatCard icon={CalendarClock} title="Upcoming" value="2" colorClass="bg-blue-500" />
          <BookingStatCard icon={Inbox} title="New Requests" value="1" colorClass="bg-yellow-500" />
          <BookingStatCard icon={BadgeCheck} title="Completed" value="28" colorClass="bg-green-500" />
          <BookingStatCard icon={XCircle} title="Cancelled" value="3" colorClass="bg-red-500" />
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by client name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-auto">
             <select
              className="w-full appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:bg-white focus:border-gray-500"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
               <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <BookingsTable 
          bookings={filteredBookings} 
          onRowClick={handleBookingClick} 
        />
        
      </main>

      {/* The Modal */}
      <BookingDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        booking={selectedBooking}
      />
    </>
  );
};