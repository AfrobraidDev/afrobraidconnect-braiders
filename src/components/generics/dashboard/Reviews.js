import React from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

export const Reviews = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="font-bold text-gray-800 mb-4">Top Client Reviews</h3>
    <div className="space-y-5">
      <div className="flex items-start space-x-4">
        <Image src="/images/customer2.jpg" alt="Sarah" width={500} height={500} className="w-10 h-10 rounded-full" />
        <div>
          <div className="flex items-center">
            <p className="font-semibold text-gray-700">Sarah O.</p>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-sm text-yellow-500">5.0</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          </div>
          <p className="text-sm text-gray-500 italic">Always the best! My braids last for weeks.</p>
        </div>
      </div>
    </div>
  </div>
);