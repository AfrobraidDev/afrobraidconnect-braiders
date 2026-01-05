import React from "react";
import { format, isToday, isTomorrow } from "date-fns";

export const NextAppointment = ({ appointment }) => {
  if (!appointment) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col justify-center items-center text-center">
        <h3 className="font-bold text-gray-800 mb-2">Next Appointment</h3>
        <p className="text-gray-400 text-sm">
          No upcoming appointments scheduled.
        </p>
      </div>
    );
  }

  const startDate = new Date(appointment.start_time);

  let dayString = format(startDate, "MMM dd");
  if (isToday(startDate)) dayString = "Today";
  else if (isTomorrow(startDate)) dayString = "Tomorrow";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-gray-800">Next Appointment</h3>
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
          {appointment.invoice_number}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary font-bold text-lg">
          {appointment.client_name?.charAt(0) || "C"}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-700 truncate">
            {appointment.client_name}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {appointment.service_name}
          </p>
        </div>

        <div className="ml-auto text-right flex-shrink-0">
          <p className="font-bold text-theme-primary">
            {format(startDate, "h:mm a")}
          </p>
          <p className="text-xs text-gray-400">{dayString}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-xs text-gray-500">
        <span>
          {appointment.client_phone !== "N/A"
            ? appointment.client_phone
            : "No phone"}
        </span>
        <span className="font-medium text-gray-900">
          ₦{appointment.total_price}
        </span>
      </div>

      <button className="w-full mt-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors">
        View Details
      </button>
    </div>
  );
};
