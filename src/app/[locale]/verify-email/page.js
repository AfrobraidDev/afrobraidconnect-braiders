"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { apiController } from "@/utils/apiController";
import Button from "@/components/generics/ui/Button";

export default function VerifyEmailPage() {
  const t = useTranslations("VerifyEmail");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyToken = async () => {
      try {
        await apiController({
          method: "GET",
          url: `/auth/verify-email/?token=${token}`,
        });
        setStatus("success");
      } catch (error) {
        console.error("Verification Error:", error);
        setStatus("error");
      }
    };

    verifyToken();
  }, [token]);

  useEffect(() => {
    let timer;
    if (status === "success" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, countdown]);

  useEffect(() => {
    if (status === "success" && countdown === 0) {
      router.push("/login");
    }
  }, [status, countdown, router]);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="text-center animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-[#b5734c] animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("verifyingTitle")}
          </h1>
          <p className="text-gray-500">{t("verifyingDesc")}</p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {t("successTitle")}
          </h1>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            {t("successDesc")}
          </p>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-4">
              {t("redirecting", { count: countdown })}
            </p>

            <Link href="/login">
              <Button className="!w-auto px-8 shadow-lg shadow-orange-900/10">
                {t("manualRedirect")} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {t("errorTitle")}
          </h1>
          <p className="text-gray-600 mb-8">{t("errorDesc")}</p>

          <Link href="/login">
            <Button variant="outline" className="!w-auto px-8">
              {t("backToLogin")}
            </Button>
          </Link>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-lg p-8">{renderContent()}</div>
      <div className="fixed bottom-8 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} AfroBraid Connect
      </div>
    </div>
  );
}
