import React from 'react';
import Image from 'next/image';

export const NextAppointment = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="font-bold text-gray-800 mb-4">Next Appointment</h3>
    <div className="flex items-center space-x-4">
      <Image
        src="/images/customerphoto.jpg"
        alt="Client"
        width={500}
        height={500}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-gray-700">Chioma Nwosu</p>
        <p className="text-sm text-gray-500">Fulani Braids</p>
      </div>
      <div className="ml-auto text-right">
        <p className="font-bold text-theme-primary">12:30 PM</p>
        <p className="text-xs text-gray-400">Today</p>
      </div>
    </div>
    <button className="w-full mt-5 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors">
      View Details
    </button>
  </div>
);