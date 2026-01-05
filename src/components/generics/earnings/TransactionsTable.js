import React from "react";

const StatusBadge = ({ status }) => {
  const isPaid = ["COMPLETED", "CONFIRMED"].includes(status);
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
        isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status}
    </span>
  );
};

export const TransactionsTable = ({ transactions = [], isLoading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <h3 className="text-lg font-bold text-gray-800 p-6 border-b border-gray-100">
        Recent Transactions
      </h3>

      {isLoading ? (
        <div className="p-8 text-center text-gray-400 text-sm">
          Loading transactions...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 hidden md:table-cell font-medium">
                  Service
                </th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {tx.client_name}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                      {tx.service_name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₦{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={tx.booking_status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No recent transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
