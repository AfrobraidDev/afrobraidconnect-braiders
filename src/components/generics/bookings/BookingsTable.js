import React from 'react';
import Image from 'next/image';
import { StatusBadge } from './StatusBadge';

export const BookingsTable = ({ bookings, onRowClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Client</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Service</th>
              <th scope="col" className="px-6 py-3 hidden lg:table-cell">Date & Time</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Price</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer" 
                  onClick={() => onRowClick(booking)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Image src={booking.client.avatar} alt={booking.client.name} width={500} height={500} className="w-10 h-10 rounded-full object-cover"/>
                      <div>
                        {booking.client.name}
                        <div className="md:hidden text-xs text-gray-500">{booking.service}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">{booking.service}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">{booking.date}</td>
                  <td className="px-6 py-4 hidden md:table-cell font-semibold">{booking.price}</td>
                  <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button className="font-medium text-theme-primary hover:underline">View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No bookings found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};