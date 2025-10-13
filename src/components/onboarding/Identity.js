"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation'; // Added useRouter for navigation
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { ShieldCheck, Clock, ShieldAlert, BadgeCheck } from "lucide-react";

// Assuming this path is correct for your ProgressBar component
import ProgressBar from '../generics/ProgressBar'; 


const CURRENT_STEP = 2; // Current step for the Progress Bar

// --- StatusBadge Component (Retained) ---
const StatusBadge = ({ status }) => {
  const statusConfig = {
    VERIFIED: {
      text: "Identity Verified",
      icon: <BadgeCheck className="w-5 h-5 text-green-600" />,
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



export default function IdDocumentVerification({ verificationStatus }) {
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
        {}, 
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
    <div>
      <ProgressBar currentStep={CURRENT_STEP} />        
        {/* Main Content Area */}
        <div> 

          {/* Identity Verification Card (Card styling based on your image) */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md">
            
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Identity Verification
                </h3>
                <p className="mt-1 text-base text-gray-600">
                  Complete this step to build trust and accept bookings.
                </p>
              </div>
              <div className="mt-1">
                <StatusBadge status={verificationStatus} />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
            {(verificationStatus === "NOT_VERIFIED" ||
              verificationStatus === "DECLINED") && (
              <div className="mt-2">
                <p className="text-base text-gray-600 mb-6 leading-relaxed">
                  {verificationStatus === "DECLINED"
                    ? "Your previous verification attempt was unsuccessful. Please try again."
                    : "You'll be asked to upload a valid ID (e.g., National ID, Passport). This helps build trust with clients and is required to list your services."}
                </p>
                
                {/* Button style updated to use the warm brand color (#b5734c) */}
                <button
                  onClick={handleVerification}
                  disabled={isLoading}
                  className="w-full py-3 px-4 font-bold text-white bg-[#b5734c] rounded-lg shadow-xl hover:bg-[#c2825d] disabled:bg-gray-400 focus:outline-none transition duration-200"
                >
                  {isLoading ? "Starting Session..." : "Verify My ID"}
                </button>
              </div>
            )}
            
            {verificationStatus === "PENDING" && (
              <div className="mt-2">
                   <p className="text-base text-gray-600 leading-relaxed">
                      Thank you! Your documents are currently being reviewed. We will notify you once the verification process is complete (usually 1-2 business days).
                   </p>
              </div>
            )}
            
            </div>
            
            {error && <p className="mt-4 text-base text-red-600">{error}</p>}
          </div>
        </div>
      </div>
  );
}
