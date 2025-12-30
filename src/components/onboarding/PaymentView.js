"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

import { apiController } from "@/utils/apiController";
import ProgressBar from "../generics/ProgressBar";
import Button from "../generics/ui/Button";

const CURRENT_STEP = 5;
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 20;

export default function PaymentSetupView() {
  const t = useTranslations("Payment");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [isPolling, setIsPolling] = useState(
    () => searchParams.get("stripe_return") === "true"
  );

  const pollAttempts = useRef(0);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["braiderProfile"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/braiders/profile/",
        requiresAuth: true,
        token: session?.accessToken,
      }).then((res) => res.data),
    enabled: !!session?.accessToken && !isPolling,
  });

  const { data: pollData, isError: isPollError } = useQuery({
    queryKey: ["stripePollStatus"],
    queryFn: async () => {
      pollAttempts.current += 1;
      const res = await apiController({
        method: "GET",
        url: "/braiders/stripe/poll-status/",
        requiresAuth: true,
        token: session.accessToken,
      });
      return res;
    },
    enabled: !!session?.accessToken && isPolling,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "COMPLETE" || pollAttempts.current >= MAX_POLL_ATTEMPTS) {
        return false;
      }
      return POLL_INTERVAL_MS;
    },
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!pollData) return;

    const status = pollData.status;

    if (status === "COMPLETE") {
      setIsPolling(false);
      toast.success("Identity verified successfully!");
      queryClient.setQueryData(["braiderProfile"], (old) => ({
        ...old,
        stripe_account_status: "COMPLETE",
      }));
    } else if (pollAttempts.current >= MAX_POLL_ATTEMPTS) {
      setIsPolling(false);
      toast(
        "Verification is taking longer than usual. Please check back later."
      );
    }
  }, [pollData, queryClient]);

  useEffect(() => {
    if (isPollError) {
      setIsPolling(false);
      toast.error("Failed to check verification status.");
    }
  }, [isPollError]);

  const connectMutation = useMutation({
    mutationFn: async () => {
      return apiController({
        method: "POST",
        url: "/braiders/stripe/onboarding/",
        requiresAuth: true,
        token: session.accessToken,
      });
    },
    onSuccess: (res) => {
      if (res.onboarding_url) {
        window.location.href = res.onboarding_url;
      } else {
        toast.error("No onboarding URL received.");
      }
    },
    onError: (error) => {
      console.error("Stripe Onboarding Error:", error);
      toast.error("Could not start Stripe setup.");
    },
  });

  const currentStatus =
    pollData?.status || profile?.stripe_account_status || "NOT_CREATED";

  const handleConnectStripe = () => {
    connectMutation.mutate();
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  const handleBack = () => {
    router.push("/onboarding/portfolio");
  };

  const handleSkip = () => {
    toast("You can complete payment setup later from your settings.", {
      icon: "ℹ️",
    });
    router.push("/dashboard");
  };

  const renderContent = () => {
    if (isPolling || (isLoadingProfile && !profile)) {
      return (
        <div className="text-center py-12">
          <div className="relative inline-flex mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-[#b5734c]/20 animate-pulse"></div>
            <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#b5734c] animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isPolling ? t("pollingTitle") : "Checking status..."}
          </h3>
          <p className="text-gray-500">
            {isPolling ? t("pollingDesc") : "Please wait a moment."}
          </p>
        </div>
      );
    }

    switch (currentStatus) {
      case "COMPLETE":
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("statusComplete")}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t("statusCompleteDesc")}
            </p>
            <Button onClick={handleFinish} className="!w-auto px-12">
              {t("btnGoDashboard")} <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case "RESTRICTED":
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("statusRestricted")}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t("statusRestrictedDesc")}
            </p>

            <div className="flex flex-col gap-3 items-center">
              <Button
                onClick={handleConnectStripe}
                isLoading={connectMutation.isPending}
                className="!w-auto px-12"
              >
                {t("btnContinueSetup")}
              </Button>
              <button
                onClick={handleSkip}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mt-2"
              >
                {t("skip")}
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white border border-gray-100 overflow-hidden">
            <div className="bg-[#635BFF]/5 p-8 text-center border-b border-[#635BFF]/10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                <Building2 className="w-8 h-8 text-[#635BFF]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t("connectTitle")}
              </h3>
              <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                {t("connectDesc")}
              </p>
            </div>

            <div className="p-8">
              <div className="grid gap-4 mb-8">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Secure Payouts
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Your bank details are encrypted and stored securely by
                      Stripe.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Fast Transfers
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Earnings are transferred directly to your bank account
                      automatically.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center flex-col items-center gap-6">
                <Button
                  onClick={handleConnectStripe}
                  isLoading={connectMutation.isPending}
                  className="!w-full sm:!w-auto px-10 bg-[#635BFF] hover:bg-[#534be0] border-transparent shadow-lg shadow-indigo-500/20"
                >
                  {t("btnConnect")}
                </Button>
                <button
                  onClick={handleSkip}
                  className="group flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-sm font-medium underline decoration-gray-300 underline-offset-4 group-hover:decoration-gray-400">
                    {t("skip")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <ProgressBar currentStep={CURRENT_STEP} />
      <div className="min-h-screen bg-gray-50 pt-[80px] pb-12">
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 mb-6">
            <button
              onClick={handleBack}
              className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              {t("back")}
            </button>

            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            <p className="text-gray-600">{t("subtitle")}</p>
          </div>

          <div className="bg-white p-6 sm:p-8 shadow-sm border border-gray-100">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}
