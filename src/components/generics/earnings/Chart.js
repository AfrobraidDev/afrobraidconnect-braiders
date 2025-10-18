'use client'; 

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const data = [
  { name: 'May', earnings: 45000 },
  { name: 'Jun', earnings: 62000 },
  { name: 'Jul', earnings: 51000 },
  { name: 'Aug', earnings: 78000 },
  { name: 'Sep', earnings: 95000 },
  { name: 'Oct', earnings: 150500 },
];

export const EarningsChart = () => {
  return (
    <div className="bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Earnings Trend</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `₦${value/1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
              }}
              formatter={(value) => [`₦${value.toLocaleString()}`, 'Earnings']}
            />
            <Line type="monotone" dataKey="earnings" stroke="#b5734c" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};