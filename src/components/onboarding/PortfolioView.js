"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

import { apiController } from "@/utils/apiController";
import ProgressBar from "../generics/ProgressBar";
import Button from "../generics/ui/Button";
import ImageUploader from "../generics/ui/ImageUploader";
import SkillSelector from "../generics/ui/SkillSelector";

const CURRENT_STEP = 4;

export default function PortfolioView() {
  const t = useTranslations("Portfolio");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [logo, setLogo] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [skills, setSkills] = useState([]);

  const [initialSkillIds, setInitialSkillIds] = useState([]);
  const [hasSynced, setHasSynced] = useState(false);

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["braiderProfile"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/braiders/profile/",
        requiresAuth: true,
        token: session?.accessToken,
      }).then((res) => res.data),
    enabled: !!session?.accessToken,
  });

  const { data: serverImages, isLoading: loadingImages } = useQuery({
    queryKey: ["portfolioImages"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/braiders/portfolio-images/",
        requiresAuth: true,
        token: session?.accessToken,
      }).then((res) => res.data),
    enabled: !!session?.accessToken,
  });

  const isLoading = loadingProfile || loadingImages;

  useEffect(() => {
    if (!isLoading && profile && !hasSynced) {
      if (profile.business_logo_url) {
        setLogo(profile.business_logo_url);
      }

      if (profile.skills) {
        setSkills(profile.skills);
        setInitialSkillIds(profile.skills.map((s) => s.id));
      }

      if (serverImages) {
        setPortfolioImages(serverImages);
      }

      setHasSynced(true);
    }
  }, [isLoading, profile, serverImages, hasSynced]);

  const logoMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("business_logo", file);
      return apiController({
        method: "PATCH",
        url: "/braiders/logo/",
        data: formData,
        requiresAuth: true,
        token: session.accessToken,
      });
    },
    onSuccess: (data) => {
      setLogo(data.business_logo_url);
      toast.success("Logo updated!");
      queryClient.invalidateQueries({ queryKey: ["braiderProfile"] });
    },
    onError: () => toast.error("Logo upload failed."),
  });

  const portfolioUploadMutation = useMutation({
    mutationFn: async (files) => {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
      return apiController({
        method: "POST",
        url: "/braiders/portfolio/upload/",
        data: formData,
        requiresAuth: true,
        token: session.accessToken,
      });
    },
    onSuccess: (res) => {
      const newImages = res.images.map((img) => ({
        id: img.id,
        image_url: img.url,
      }));
      setPortfolioImages((prev) => [...prev, ...newImages]);
      toast.success(`${res.images.length} images uploaded!`);
      queryClient.invalidateQueries({ queryKey: ["portfolioImages"] });
    },
    onError: () => toast.error("Portfolio upload failed."),
  });

  const portfolioDeleteMutation = useMutation({
    mutationFn: async (imageId) => {
      return apiController({
        method: "DELETE",
        url: `/braiders/portfolio-images/${imageId}/`,
        requiresAuth: true,
        token: session.accessToken,
      });
    },
    onMutate: async (imageId) => {
      const previousImages = portfolioImages;
      setPortfolioImages((prev) => prev.filter((img) => img.id !== imageId));
      return { previousImages };
    },
    onError: (err, imageId, context) => {
      if (context?.previousImages) {
        setPortfolioImages(context.previousImages);
      }
      toast.error("Failed to delete image.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioImages"] });
    },
  });

  const saveSkillsMutation = useMutation({
    mutationFn: async () => {
      const currentSkillIds = skills.map((s) => s.id);
      return apiController({
        method: "PATCH",
        url: "/braiders/profile/skills/",
        data: { skills: currentSkillIds },
        requiresAuth: true,
        token: session.accessToken,
      });
    },
    onSuccess: () => {
      toast.success("Profile saved!");
      queryClient.invalidateQueries({ queryKey: ["braiderProfile"] });
      router.push("/onboarding/pricing");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to save changes.");
    },
  });

  const handleLogoUpload = (file) => {
    logoMutation.mutate(file);
  };

  const handlePortfolioUpload = (files) => {
    portfolioUploadMutation.mutate(files);
  };

  const handleRemovePortfolioImage = (imageId) => {
    portfolioDeleteMutation.mutate(imageId);
  };

  const handleSaveAndContinue = () => {
    const currentSkillIds = skills.map((s) => s.id);
    const hasSkillsChanged =
      JSON.stringify(currentSkillIds.sort()) !==
      JSON.stringify([...initialSkillIds].sort());

    if (!hasSkillsChanged) {
      router.push("/onboarding/pricing");
      return;
    }

    saveSkillsMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-[80px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b5734c]"></div>
      </div>
    );
  }

  return (
    <>
      <ProgressBar currentStep={CURRENT_STEP} />
      <div className="min-h-screen bg-gray-50 pt-[80px] pb-12">
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 shadow-sm border border-gray-100 mt-6 space-y-8">
            <div>
              <button
                onClick={() => router.push("/onboarding/services")}
                className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
              >
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
                {tCommon("back")}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
              <p className="text-gray-600 mt-1">{t("subtitle")}</p>
            </div>

            <hr className="border-gray-100" />

            <section>
              <ImageUploader
                label={t("logoSection")}
                description={t("logoDesc")}
                images={logo ? [{ id: "logo", image_url: logo }] : []}
                onUpload={handleLogoUpload}
                onRemove={() => setLogo(null)}
                isLoading={logoMutation.isPending}
                multiple={false}
              />
            </section>

            <hr className="border-gray-100" />
            <section>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t("skillsSection")}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{t("skillsDesc")}</p>
              <SkillSelector selectedSkills={skills} onChange={setSkills} />
            </section>

            <hr className="border-gray-100" />

            <section>
              <ImageUploader
                label={t("portfolioSection")}
                description={t("portfolioDesc")}
                images={portfolioImages}
                onUpload={handlePortfolioUpload}
                onRemove={handleRemovePortfolioImage}
                isLoading={portfolioUploadMutation.isPending}
                multiple={true}
              />
            </section>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSaveAndContinue}
                isLoading={saveSkillsMutation.isPending}
                className="!w-auto px-12 shadow-lg shadow-orange-900/10"
              >
                {t("saveAndContinue")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
