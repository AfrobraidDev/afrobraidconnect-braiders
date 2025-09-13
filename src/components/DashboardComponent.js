// src/app/dashboard/page.js
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import OnboardingWizard from "./OnboardingWizard";
import { LogOut, User } from "lucide-react";
import axios from "axios";

export default function DashboardComponent() {
  // ✅ useSession now includes the 'update' function
  const { data: session, status, update } = useSession();
  const router = useRouter();
  // ✅ Hook to read URL query parameters
  const searchParams = useSearchParams();

  // ✅ Function to fetch latest user data and update the session
  const refreshSession = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      console.log("Refreshing session data...");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/`, // Your endpoint to get the current user
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      // Update the session with the fresh user data from the backend
      await update({
        ...session,
        user: response.data,
      });
      console.log("Session refreshed successfully.");

      // Clean the URL by removing the query parameter
      router.replace("/dashboard", { scroll: false });
    } catch (error) {
      console.error("Failed to refresh session:", error);
    }
  }, [session, update, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // ✅ Check for our signal from the backend
    if (
      status === "authenticated" &&
      searchParams.get("verification_complete") === "true"
    ) {
      refreshSession();
    }
  }, [status, router, searchParams, refreshSession]);

  if (status === "loading" || !session) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg">Loading...</p>
      </main>
    );
  }

  // Check if the user is a braider and get their profile
  const isBraider = session.user.role === "BRAIDER";
  const braiderProfile = session.user.braiderProfile;

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {session.user.name}!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Here&apos;s your braider dashboard overview.
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Onboarding and Profile */}
          <div className="lg:col-span-2 space-y-8">
            {isBraider && <OnboardingWizard profile={braiderProfile} />}
          </div>

          {/* Right Column: Quick Stats or Profile Info */}
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User size={20} />
                Your Info
              </h3>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Email:</strong> {session.user.email}
                </p>
                <p>
                  <strong>Role:</strong> {session.user.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
