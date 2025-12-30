"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import { User, Info, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useBraiderProfile } from "./hooks/useBraiderProfile";
import ProgressBar from "../generics/ProgressBar";
import Input from "../generics/ui/Input";
import Textarea from "../generics/ui/Textarea";
import Button from "../generics/ui/Button";
import { useTranslations } from "next-intl";

const MAX_CHARACTERS = 200;
const CURRENT_STEP = 1;

export default function BusinessInfoView() {
  const t = useTranslations("BusinessInfo");
  const tCommon = useTranslations("Common");

  const router = useRouter();

  const { data, isLoading, updateProfile, isUpdating } = useBraiderProfile();

  const [formData, setFormData] = useState({
    businessName: "",
    displayName: "",
    clientDescription: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        businessName: data.business_name || "",
        displayName: data.display_name || "",
        clientDescription: data.bio || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "clientDescription" && value.length > MAX_CHARACTERS) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasChanges =
      formData.businessName !== (data?.business_name || "") ||
      formData.displayName !== (data?.display_name || "") ||
      formData.clientDescription !== (data?.bio || "");

    if (!hasChanges) {
      router.push("/onboarding/identity");
      return;
    }

    try {
      await updateProfile({
        business_name: formData.businessName,
        display_name: formData.displayName,
        bio: formData.clientDescription,
      });

      toast.success("Profile updated successfully!");
      router.push("/onboarding/identity");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.message || "Something went wrong.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-[80px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#b5734c] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ProgressBar currentStep={CURRENT_STEP} />
      <div className="min-h-screen bg-white pt-[80px]">
        <div className="max-w-[700px] w-full mx-auto p-4 sm:p-8 lg:p-10">
          <div className="mb-4 text-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t("title")}
            </h2>
            <p className="text-base text-gray-600">{t("subtitle")}</p>
          </div>

          <hr className="border-gray-200 mb-6" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={
                <span>
                  {t("businessNameLabel")}{" "}
                  <span className="text-red-500">*</span>
                </span>
              }
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. Slay By Jess LLC"
              required
            />

            <Input
              label={
                <span className="flex items-center">
                  {t("displayNameLabel")}
                  <span
                    className="text-gray-400 font-normal ml-2"
                    title={t("displayNameTooltip")}
                  >
                    <Info size={16} className="text-gray-700" />
                  </span>
                </span>
              }
              icon={User}
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="e.g. Jess Braids"
            />

            <div>
              <Textarea
                label={
                  <span>
                    {t("bioLabel")}
                    <span className="text-red-500">*</span>
                  </span>
                }
                name="clientDescription"
                value={formData.clientDescription}
                onChange={handleChange}
                placeholder={t("bioPlaceholder")}
                required
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.clientDescription.length}/{MAX_CHARACTERS}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                isLoading={isUpdating}
                className="!w-auto px-10 min-w-[140px]"
              >
                {tCommon("continue")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
