import React from 'react';

const transactions = [
  { id: 1, date: 'Oct 12, 2025', client: 'Adaeze Okafor', service: 'Knotless Braids', amount: '₦25,000', status: 'Paid' },
  { id: 2, date: 'Oct 10, 2025', client: 'Bisi Adekunle', service: 'Stitch Lines', amount: '₦15,000', status: 'Paid' },
  { id: 3, date: 'Oct 09, 2025', client: 'Ngozi Eze', service: 'Box Braids', amount: '₦20,000', status: 'Paid' },
  { id: 4, date: 'Oct 05, 2025', client: 'Fatima Bello', service: 'Fulani Braids', amount: '₦30,000', status: 'Pending' },
];

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
    status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }`}>
    {status}
  </span>
);

export const TransactionsTable = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <h3 className="text-lg font-bold text-gray-800 p-4 border-b">Recent Transactions</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Client</th>
            <th className="px-6 py-3 hidden md:table-cell">Service</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-600">{tx.date}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{tx.client}</td>
              <td className="px-6 py-4 hidden md:table-cell">{tx.service}</td>
              <td className="px-6 py-4 font-semibold">{tx.amount}</td>
              <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);