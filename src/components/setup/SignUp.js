"use client";

import React, { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, usePathname, Link } from "@/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Lock,
  Mail,
  User,
  Globe,
  ChevronUp,
  Check,
  ChevronLeft,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useTranslations, useLocale } from "next-intl";
import { apiController } from "@/utils/apiController";
import Input from "../generics/ui/Input";
import Button from "../generics/ui/Button";

function setAuthIntent(intent) {
  document.cookie = `auth-intent=${intent}; path=/; max-age=300`;
}

export default function SignupView({ onBack }) {
  const t = useTranslations("Auth");
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "BRAIDER",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");

    if (errorParam) {
      if (errorParam === "AccountExists") {
        setError(
          t("accountExistsError") || "Account already exists. Please log in."
        );
      } else if (errorParam === "AuthFailed") {
        setError("Authentication failed.");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleSignUp = () => {
    setAuthIntent("signup");
    signIn("google", {
      callbackUrl: `/${currentLocale}/auth/callback`,
    });
  };

  const handleCredentialsSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await apiController({
        method: "POST",
        url: "/auth/register/",
        data: formData,
      });

      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setError(
        err?.data?.message ||
          err?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t("successTitle")}
          </h2>
          <p className="text-gray-600">
            {t("successDesc", { email: formData.email })}
          </p>
          <div className="pt-6">
            <Link href="/login">
              <Button className="!w-full">{t("loginLink")}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT COLUMN: FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16 relative">
        {/* Mobile Back Button */}
        <header className="absolute top-6 left-6">
          <button
            onClick={onBack || (() => router.back())}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        </header>

        <main className="flex-grow flex flex-col justify-center max-w-md mx-auto py-16 w-full">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
            {t("signupTitle")}
          </h1>
          <p className="text-base text-gray-600 mb-8">{t("signupSubtitle")}</p>

          {error && (
            <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t("firstName")}
                type="text"
                icon={User}
                name="first_name"
                placeholder="James"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <Input
                label={t("lastName")}
                type="text"
                icon={User}
                name="last_name"
                placeholder="Brown"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label={t("emailLabel")}
              type="email"
              icon={Mail}
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label={t("passwordLabel")}
              type="password"
              icon={Lock}
              name="password"
              placeholder={t("passwordPlaceholder") || "••••••••"}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label={t("confirmPasswordLabel")}
              type="password"
              icon={Lock}
              name="confirm_password"
              placeholder={t("passwordPlaceholder") || "••••••••"}
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="!w-full !py-3"
            >
              {isLoading ? t("creatingAccount") : t("createAccount")}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="px-4 text-sm text-gray-500">{t("or")}</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleSignUp}
            icon={FcGoogle}
            className="w-full"
          >
            {t("googleSignUp")}
          </Button>

          <div className="text-center mt-6 text-sm text-gray-500">
            {t("termsText")}
            <Link
              href="/terms"
              className="text-[#b5734c] font-medium ml-1 hover:underline"
            >
              {t("termsLink")}
            </Link>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="text-[#b5734c] font-medium hover:underline ml-1"
            >
              {t("loginLink")}
            </Link>
          </p>
        </main>

        {/* Footer */}
        <footer className="mt-8 flex justify-between items-center text-xs text-gray-500 relative">
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

      {/* RIGHT IMAGE PANEL */}
      <div className="relative w-1/2 bg-gray-200 hidden md:block">
        <Image
          src="/images/person8.jpg"
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
