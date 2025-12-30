"use client";

import React, { useState } from "react";
import { useRouter } from "@/navigation";
import { useSession } from "next-auth/react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Smartphone,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useBraiderProfile } from "./hooks/useBraiderProfile";
import { apiController } from "@/utils/apiController";

import ProgressBar from "../generics/ProgressBar";
import Button from "../generics/ui/Button";
import Input from "../generics/ui/Input";

const CURRENT_STEP = 2;

export default function IdentityVerificationView() {
  const router = useRouter();
  const t = useTranslations("Identity");
  const tCommon = useTranslations("Common");

  const { data: session } = useSession();
  const {
    data: profile,
    isLoading: isProfileLoading,
    mutate: refreshProfile,
  } = useBraiderProfile();

  const [isVerifyingDoc, setIsVerifyingDoc] = useState(false);

  const [phoneStep, setPhoneStep] = useState("INPUT");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  const docStatus = profile?.document_verification_status || "NOT_VERIFIED";
  const isPhoneVerified = profile?.is_phone_verified || false;

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return toast.error("Please enter a phone number");

    setIsPhoneLoading(true);
    try {
      await apiController({
        method: "POST",
        url: "/braiders/verify-phone/request/",
        requiresAuth: true,
        token: session?.accessToken,
        data: { phone_number: phoneNumber },
      });
      toast.success(t("codeSent") + " " + phoneNumber);
      setPhoneStep("OTP");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to send code.");
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the code");

    setIsPhoneLoading(true);
    try {
      await apiController({
        method: "POST",
        url: "/braiders/verify-phone/confirm/",
        requiresAuth: true,
        token: session?.accessToken,
        data: { otp },
      });
      toast.success("Phone verified successfully!");
      refreshProfile();
      setPhoneStep("INPUT");
      setOtp("");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Invalid code.");
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleStartDocVerification = async () => {
    setIsVerifyingDoc(true);
    try {
      const response = await apiController({
        method: "POST",
        url: "/braiders/verify-document/create-session/",
        requiresAuth: true,
        token: session?.accessToken,
        data: {},
      });

      if (response.verification_url) {
        window.location.href = response.verification_url;
      } else {
        throw new Error("No URL received");
      }
    } catch (error) {
      toast.error("Could not start verification.");
      setIsVerifyingDoc(false);
    }
  };

  const handleContinue = () => {
    if (!isPhoneVerified) {
      toast.error("Please verify your phone number first.");
      return;
    }
    router.push("/onboarding/services");
  };

  const handleBack = () => {
    router.push("/onboarding/business-info");
  };

  const renderDocStatus = () => {
    switch (docStatus) {
      case "VERIFIED":
        return {
          icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
          title: t("statusVerifiedTitle"),
          desc: t("statusVerifiedDesc"),
          color: "bg-green-50 border-green-200",
          btn: null,
        };
      case "PENDING":
        return {
          icon: <Clock className="w-12 h-12 text-yellow-500" />,
          title: t("statusPendingTitle"),
          desc: t("statusPendingDesc"),
          color: "bg-yellow-50 border-yellow-200",
          btn: (
            <Button
              variant="outline"
              onClick={handleStartDocVerification}
              isLoading={isVerifyingDoc}
              className="mt-4"
            >
              {t("btnResubmit")}
            </Button>
          ),
        };
      case "DECLINED":
        return {
          icon: <ShieldAlert className="w-12 h-12 text-red-500" />,
          title: t("statusDeclinedTitle"),
          desc: t("statusDeclinedDesc"),
          color: "bg-red-50 border-red-200",
          btn: (
            <Button
              onClick={handleStartDocVerification}
              isLoading={isVerifyingDoc}
              className="mt-4"
            >
              {t("btnVerify")}
            </Button>
          ),
        };
      default:
        return {
          icon: <Shield className="w-12 h-12 text-[#b5734c]" />,
          title: t("statusDefaultTitle"),
          desc: t("statusDefaultDesc"),
          color: "bg-white border-gray-200",
          btn: (
            <Button
              onClick={handleStartDocVerification}
              isLoading={isVerifyingDoc}
              className="mt-4"
            >
              {t("btnVerify")}
            </Button>
          ),
        };
    }
  };

  const docContent = renderDocStatus();

  if (isProfileLoading) {
    return (
      <>
        <ProgressBar currentStep={CURRENT_STEP} />
        <div className="min-h-screen pt-[80px] flex items-center justify-center bg-white">
          <p className="text-gray-500 animate-pulse">{tCommon("loading")}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ProgressBar currentStep={CURRENT_STEP} />
      <div className="min-h-screen bg-gray-50 pt-[80px] pb-12">
        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 mb-6">
            <button
              onClick={handleBack}
              className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              {tCommon("back")}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            <p className="text-gray-600 mt-1">{t("subtitle")}</p>
          </div>

          <div className="space-y-6">
            <div
              className={`p-6 border transition-all duration-300 ${
                isPhoneVerified
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    isPhoneVerified
                      ? "bg-white text-green-600"
                      : "bg-orange-50 text-[#b5734c]"
                  }`}
                >
                  {isPhoneVerified ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Smartphone size={24} />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isPhoneVerified ? t("phoneVerified") : t("phoneTitle")}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {isPhoneVerified
                      ? `${t("codeSent")} ${
                          profile?.phone_number || phoneNumber
                        }`
                      : t("phoneDesc")}
                  </p>
                  {!isPhoneVerified && (
                    <div className="max-w-sm space-y-4">
                      {phoneStep === "INPUT" ? (
                        <form
                          onSubmit={handleRequestOtp}
                          className="flex flex-col gap-4"
                        >
                          <div>
                            <Input
                              label={t("phoneLabel")}
                              placeholder={t("phonePlaceholder")}
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              {t("phoneDesc")}
                            </p>
                          </div>

                          <Button
                            type="submit"
                            isLoading={isPhoneLoading}
                            className="!w-full"
                          >
                            {t("btnSendCode")}
                          </Button>
                        </form>
                      ) : (
                        <form
                          onSubmit={handleVerifyOtp}
                          className="flex flex-col gap-4"
                        >
                          <div className="text-sm text-gray-600">
                            {t("codeSent")}{" "}
                            <span className="font-medium text-gray-900">
                              {phoneNumber}
                            </span>
                          </div>
                          <Input
                            label={t("otpLabel")}
                            placeholder={t("otpPlaceholder")}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                            icon={Lock}
                          />
                          <Button
                            type="submit"
                            isLoading={isPhoneLoading}
                            className="!w-full"
                          >
                            {t("btnVerifyCode")}
                          </Button>
                          <button
                            type="button"
                            onClick={() => setPhoneStep("INPUT")}
                            className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-center"
                          >
                            {t("btnChangePhone")}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`p-6 border transition-all duration-300 ${docContent.color} shadow-sm`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full shadow-sm text-gray-700">
                  {docContent.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {docContent.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {docContent.desc}
                  </p>

                  {docContent.btn && (
                    <div className="max-w-xs">{docContent.btn}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end pb-12">
            <Button
              onClick={handleContinue}
              className="!w-auto px-10 shadow-lg shadow-orange-900/10"
              disabled={!isPhoneVerified}
            >
              {t("btnContinue")} <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border-t border-gray-100 pt-8">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-5 h-5 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-medium">
                {tCommon("secureEncryption")}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-5 h-5 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-medium">
                {tCommon("dataPrivacy")}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-5 h-5 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-medium">
                {tCommon("support247")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
