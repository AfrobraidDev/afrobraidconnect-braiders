"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      // && session?.user?.braiderProfile
      const profile = session?.user?.braiderProfile || {};

      const isPhoneVerified = profile.is_phone_verified === true;
      const isDocVerified = profile.document_verification_status === "VERIFIED";
      const isPayoutsEnabled = profile.is_payouts_enabled === true;

      if (isPhoneVerified && isDocVerified && isPayoutsEnabled) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboarding/business-info");
      }
    } else {
      router.replace("/onboarding/business-info");
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-[#b5734c] animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Verifying profile status...</p>
    </div>
  );
}
