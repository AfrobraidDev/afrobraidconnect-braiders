"use client";

import React, { useState, useRef, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, usePathname, Link } from "@/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, Globe, ChevronUp, Check } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useTranslations, useLocale } from "next-intl";
import Input from "../generics/ui/Input";
import Button from "../generics/ui/Button";

function setAuthIntent(intent) {
  document.cookie = `auth-intent=${intent}; path=/; max-age=300`;
}

export default function LoginView({ onBack }) {
  const t = useTranslations("Auth");
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");

    if (errorParam) {
      if (errorParam === "AccountExists") {
        setError(
          t("accountExistsError") ||
            "This account already exists. Please log in."
        );
      } else if (errorParam === "AuthFailed") {
        setError("Account not found. Please sign up first.");
      } else {
        setError(errorParam);
      }
    }
  }, [searchParams, t]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "en", label: "English" },
    { code: "de", label: "Deutsch" },
    { code: "fr", label: "Français" },
  ];

  const handleLanguageChange = (newLocale) => {
    router.replace(pathname, { locale: newLocale });
    setIsLangMenuOpen(false);
  };

  const handleGoogleSignIn = () => {
    setAuthIntent("login");

    signIn("google", {
      callbackUrl: `/${currentLocale}/auth/callback`,
    });
  };

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setIsLoading(false);
      setError("Invalid email or password. Please try again.");
    } else if (result.ok) {
      const session = await getSession();
      const profile = session?.user?.braiderProfile;
      const isPhoneVerified = profile?.is_phone_verified === true;
      const isDocVerified =
        profile?.document_verification_status === "VERIFIED";
      const isPayoutsEnabled = profile?.is_payouts_enabled === true;

      if (isPhoneVerified && isDocVerified && isPayoutsEnabled) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding/business-info");
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16">
        <main className="flex-grow flex flex-col justify-center max-w-md mx-auto py-10 w-full">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
            {t("loginTitle")}
          </h1>
          <p className="text-base text-gray-600 mb-8">{t("loginSubtitle")}</p>

          {error && (
            <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-sm font-semibold text-gray-800">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  icon={Mail}
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-sm font-semibold text-gray-800">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  icon={Lock}
                  placeholder={t("passwordPlaceholder") || "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end mt-2 text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-[#b5734c] hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white bg-[#b5734c] hover:bg-[#b47550] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b47550] disabled:opacity-70 transition-colors"
            >
              {isLoading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="px-4 text-sm text-gray-500">{t("or")}</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            icon={FcGoogle}
            className="w-full"
          >
            {t("googleSignIn")}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-8">
            {t("signUpPrompt")}{" "}
            <Link
              href="/signup"
              className="text-[#b5734c] font-medium hover:underline ml-1"
            >
              {t("signUpLink")}
            </Link>
          </p>

          <p className="text-center text-sm text-gray-600 mt-2">
            {t("notVerifiedPrompt")}{" "}
            <Link
              href="/resend-verification"
              className="text-[#b5734c] font-medium hover:underline ml-1"
            >
              {t("revalidateLink")}
            </Link>
          </p>
        </main>

        <footer className="mt-12 flex justify-between items-center text-xs text-gray-500 relative">
          <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>support@afrobraidconnect.de</span>
          </div>
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center space-x-2 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <Globe className="w-4 h-4" />
              <span className="font-bold uppercase">{currentLocale}</span>
              <ChevronUp
                className={`w-3 h-3 transition-transform duration-200 ${
                  isLangMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isLangMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-40 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`
                        w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors
                        ${
                          currentLocale === lang.code
                            ? "text-[#b5734c] font-semibold bg-orange-50/50"
                            : "text-gray-700"
                        }
                      `}
                    >
                      <span>{lang.label}</span>
                      {currentLocale === lang.code && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </footer>
      </div>

      {/* Right Column: Image */}
      <div className="relative w-1/2 bg-gray-200 hidden md:block">
        <Image
          src="/images/hero.png"
          alt="Customer booking appointment"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 0vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
    </div>
  );
}
