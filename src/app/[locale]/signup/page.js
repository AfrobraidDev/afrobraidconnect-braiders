"use client";

import { useRouter } from "@/navigation";
import SignUpView from "@/components/setup/SignUp";

export default function SignUpPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return <SignUpView onBack={handleBack} />;
}
