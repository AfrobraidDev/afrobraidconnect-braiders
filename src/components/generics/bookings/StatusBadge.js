import React from "react";

const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-indigo-100 text-indigo-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  DECLINED: "bg-red-100 text-red-800",
  REFUND_PENDING: "bg-orange-100 text-orange-800",
  REFUNDED: "bg-gray-100 text-gray-800",
  REFUND_FAILED: "bg-red-200 text-red-900",
  EXPIRED: "bg-gray-200 text-gray-600",
};

export const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-800";
  const label =
    status
      ?.replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()) || "Unknown";

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${style}`}
    >
      {label}
    </span>
  );
};
