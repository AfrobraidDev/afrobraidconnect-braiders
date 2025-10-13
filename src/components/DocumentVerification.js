// src/app/components/DocumentVerification.js
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ShieldCheck, Clock, ShieldAlert, BadgeCheck } from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    VERIFIED: {
      text: "Identity Verified",
      icon: <ShieldCheck className="w-5 h-5 text-green-600" />,
      className: "bg-green-100 text-green-800",
    },
    PENDING: {
      text: "Verification Pending",
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
      className: "bg-yellow-100 text-yellow-800",
    },
    DECLINED: {
      text: "Verification Declined",
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      className: "bg-red-100 text-red-800",
    },
    NOT_VERIFIED: {
      text: "Not Verified",
      icon: <ShieldAlert className="w-5 h-5 text-gray-600" />,
      className: "bg-gray-100 text-gray-800",
    },
  };

  const config = statusConfig[status] || statusConfig.NOT_VERIFIED;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${config.className}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

export default function DocumentVerification({ verificationStatus }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerification = async () => {
    if (!session?.accessToken) {
      setError("You are not authenticated.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/braiders/verify-document/create-session/`,
        {}, // No body needed, user is identified by token
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const { verification_url } = response.data;
      if (verification_url) {
        // Redirect the user to Veriff's secure verification page
        window.location.href = verification_url;
      } else {
        throw new Error("Verification URL not received.");
      }
    } catch (err) {
      console.error("Failed to start verification:", err);
      setError(
        "Could not start the verification process. Please try again later."
      );
      setIsLoading(false);
    }
    
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Identity Verification
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Complete this step to build trust and accept bookings.
          </p>
        </div>
        <StatusBadge status={verificationStatus} />
      </div>

      {(verificationStatus === "NOT_VERIFIED" ||
        verificationStatus === "DECLINED") && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            {verificationStatus === "DECLINED"
              ? "Your previous verification attempt was unsuccessful. Please try again."
              : "You'll be asked to upload a valid ID (e.g., National ID, Passport)."}
          </p>
          <button
            onClick={handleVerification}
            disabled={isLoading}
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            {isLoading ? "Starting..." : "Verify My ID"}
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
