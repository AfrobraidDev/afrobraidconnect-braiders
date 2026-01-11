"use client";

import { useState } from "react";
import { useRouter, Link } from "@/navigation";
import { useParams } from "next/navigation";
import { Lock, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { apiController } from "@/utils/apiController";
import Input from "@/components/generics/ui/Input";
import Button from "@/components/generics/ui/Button";

export default function ResetPasswordConfirmPage() {
  const t = useTranslations("ResetPassword");
  const params = useParams();
  const { uidb64, token } = params;
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password2) {
      setError(t("errorMatch"));
      return;
    }

    setIsLoading(true);
    try {
      await apiController({
        method: "PATCH",
        url: "/auth/password-reset-complete/",
        data: { ...formData, uidb64, token },
      });

      setIsSuccess(true);
      router.push("/login");
    } catch (err) {
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
              <Lock className="w-8 h-8 text-[#b5734c]" />
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
        </div>

        {isSuccess ? (
          <div className="space-y-6 text-center animate-in zoom-in-95">
            <div className="p-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg">
              {t("successMessage")}
            </div>
            <Link href="/login" className="block">
              <Button className="!w-full">{t("loginLink")}</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={t("passwordLabel")}
              id="password"
              name="password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              placeholder={t("placeholder")}
              required
            />

            <Input
              label={t("confirmPasswordLabel")}
              id="password2"
              name="password2"
              type="password"
              icon={Lock}
              value={formData.password2}
              onChange={handleChange}
              placeholder={t("placeholder")}
              required
            />

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center animate-pulse">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="!w-full">
              {isLoading ? t("submitting") : t("submitBtn")}
            </Button>
          </form>
        )}
      </div>

      {/* Footer Copy */}
      <div className="fixed bottom-6 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} AfroBraid Connect
      </div>
    </main>
  );
}
