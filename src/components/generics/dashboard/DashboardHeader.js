import React from 'react';
import Image from 'next/image';


export const DashboardHeader = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Good morning! ☀️</h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s what&apos;s happening in Port Harcourt today, {formattedDate}.
        </p>
      </div>
      <div className="flex items-center mt-4 sm:mt-0">
        <Image
          src="/images/profile.jpg" 
          alt="Profile"
          width={500}
          height={500}
          className="w-12 h-12 rounded-full border-1 border-[#b5734c] object-cover"
        />
      </div>
    </div>
  );
};

