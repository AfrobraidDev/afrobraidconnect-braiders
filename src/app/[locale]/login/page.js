"use client";

import { useRouter } from "@/navigation";
import LoginView from "@/components/setup/Login";

export default function LoginPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return <LoginView onBack={handleBack} />;
}
