import React from 'react';

export const ClientStatusBadge = ({ status }) => {
  const styles = {
    Active: 'bg-green-100 text-green-800',
    New: 'bg-blue-100 text-blue-800',
    Inactive: 'bg-gray-200 text-gray-700',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};