// src/app/dashboard/page.js
"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { apiController } from "@/utils/apiController";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSignOut = async () => {
    if (session?.accessToken && session?.refreshToken) {
      try {
        await apiController({
          method: "POST",
          url: "/auth/logout/",
          data: { refresh: session.refreshToken },
          requiresAuth: true,
          token: session.accessToken,
        });
      } catch (error) {
        console.error("Failed to logout from backend.");
      } finally {
        signOut({ callbackUrl: "/login" });
      }
    } else {
      signOut({ callbackUrl: "/login" });
    }
  };

  if (status === "loading") {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </main>
    );
  }

  if (status === "authenticated") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-black">
            Welcome, {session.user.name}!
          </h1>
          <p className="mt-4 text-sm text-gray-600 break-all">
            <strong>Access Token:</strong>{" "}
            <code className="block p-2 mt-1 text-xs bg-gray-100 rounded">
              {session.accessToken}
            </code>
          </p>
          <button
            onClick={handleSignOut}
            className="w-full mt-6 px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  return null;
}
