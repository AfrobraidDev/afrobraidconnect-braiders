// src/app/profile/verify/page.js
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DocumentVerification from "@/components/DocumentVerification";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the session is loading, do nothing.
    if (status === "loading") return;

    // If the user is not authenticated or is not a braider, redirect them.
    if (status === "unauthenticated" || session?.user.role !== "BRAIDER") {
      router.push("/login");
    }
  }, [status, session, router]);

  // Show a loading state while the session is being determined
  if (status === "loading" || !session) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </main>
    );
  }

  const verificationStatus =
    session.user.braiderProfile?.document_verification_status;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back to Dashboard Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 mx-auto text-indigo-500" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Identity Verification
          </h1>
          <p className="mt-2 text-md text-gray-600">
            Please verify your identity to complete your profile and start
            accepting bookings.
          </p>
        </div>

        {/* Verification Component */}
        <div className="bg-white rounded-xl shadow-md">
          <DocumentVerification verificationStatus={verificationStatus} />
        </div>
      </div>
    </main>
  );
}
