"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, XCircle, Loader2 } from "lucide-react"; 
import { apiController } from "@/utils/apiController";

// --- Theme Colors ---
const BRAND_COLOR = "#b5734c"; // Primary accent color (deep orange/brown)
const BRAND_HOVER = "#c2825d"; 
const LOGO_COLOR = "#d3986a"; // The slightly lighter orange/brown used for the logo

function VerificationComponent() {
  const searchParams = useSearchParams();
  // Using useSearchParams().get("token") directly is standard, ensuring it works in Next.js App Router
  const token = searchParams.get("token"); 
  
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Fetching your details and confirming registration..."
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification link is incomplete. Please check your email and ensure the link is fully copied.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await apiController({
          method: "GET",
          url: `/auth/verify-email/`,
          params: { token },
        });

        // Adjusted check based on your reported API response structure
        if (response.email === "Successfully activated" || response.message === "Email verified") { 
          setStatus("success");
          setMessage("Your email address is now confirmed! Welcome to afrB. Click below to continue your journey.");
        } else {
          throw new Error("Unexpected server response. Please try clicking the link again.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message ||
          "Verification failed. The link may be expired, already used, or invalid. Request a new one below."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    // CARD: Removed shadow-2xl and rounded-xl
    <div className="w-full max-w-lg p-8 sm:p-10 space-y-6 text-center bg-white border border-gray-300">
      
      {/* Brand Logo Header */}
      <div className="pb-4">
         <div>
            <Image src="/images/mainlogo.png" alt="AfroB Logo" width={80} height={80} className="object-contain" />
         </div>
      </div>

      {/* --- ICON & STATUS HEADER --- */}
      {status === "verifying" && (
        <>
          <Loader2 className="w-10 h-10 mx-auto animate-spin" style={{ color: LOGO_COLOR }} />
          <h1 className="text-2xl font-extrabold text-gray-900">Verifying Email...</h1>
        </>
      )}
      
      {status === "success" && (
        <>
          <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Email Verified! 🎉
          </h1>
        </>
      )}
      
      {status === "error" && (
        <>
          <XCircle className="w-16 h-16 mx-auto text-red-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Verification Failed
          </h1>
        </>
      )}
      
      {/* --- MESSAGE BODY --- */}
      <p className="text-base text-gray-600">
        {message}
      </p>

      {/* --- ACTIONS --- */}
      <div className="pt-4 space-y-3">
        {(status === "success" || status === "error") && (
          <Link
            href="/login"
            // BUTTON: Removed rounded-lg and shadow-md
            className="inline-block w-full px-4 py-3.5 font-bold text-lg text-white transition duration-200"
            style={{ backgroundColor: BRAND_COLOR }}
          >
            {status === 'success' ? 'Proceed to Login' : 'Go to Login Page'}
          </Link>
        )}
        
        {status === "error" && (
            <Link
                href="/resend-verification"
                // BUTTON: Removed rounded-lg
                className="block w-full py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition"
            >
                Or click here to Resend Verification Email
            </Link>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <Suspense fallback={
        // FALLBACK CARD: Removed shadow-2xl and rounded-xl
        <div className="w-full max-w-lg p-10 text-center bg-white border border-gray-300">
            <Loader2 className="w-10 h-10 mx-auto animate-spin" style={{ color: LOGO_COLOR }} />
            <p className="mt-4 text-gray-600">Loading verification component...</p>
        </div>
      }>
        <VerificationComponent />
      </Suspense>
    </main>
  );
}