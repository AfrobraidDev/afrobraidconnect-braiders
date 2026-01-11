"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { apiController } from "@/utils/apiController";
import Input from "@/components/generics/ui/Input";
import Button from "@/components/generics/ui/Button";

export default function ResendVerificationPage() {
  const t = useTranslations("ResendVerification");

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiController({
        method: "POST",
        url: "/auth/resend-verification/",
        data: { email },
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err?.detail || t("errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center mb-6">
          <div
            className={`p-4 rounded-full ${
              isSuccess ? "bg-green-50" : "bg-orange-50"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : (
              <Send className="w-8 h-8 text-[#b5734c]" />
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isSuccess ? t("successTitle") : t("title")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isSuccess ? t("successDesc", { email: email }) : t("subtitle")}
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4">
            <Link href="/login" className="block">
              <Button className="!w-full">{t("backToLogin")}</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label={t("emailLabel")}
                type="email"
                icon={Mail}
                id="email"
                name="email"
                placeholder={t("placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center animate-pulse">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="!w-full">
              {isLoading ? t("submitting") : t("submitBtn")}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#b5734c] transition-colors group"
              >
                <ArrowLeft
                  size={16}
                  className="mr-2 group-hover:-translate-x-1 transition-transform"
                />
                {t("backToLogin")}
              </Link>
            </div>
          </form>
        )}
      </div>

      <div className="fixed bottom-6 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} AfroBraid Connect
      </div>
    </main>
  );
}
