"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { apiController } from "@/utils/apiController";
import ImageUploader from "../generics/ui/ImageUploader";

export default function PortfolioView() {
  const t = useTranslations("Portfolio");
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [portfolioImages, setPortfolioImages] = useState([]);

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
      if (serverImages) {
        setPortfolioImages(serverImages);
      }

      setHasSynced(true);
    }
  }, [isLoading, profile, serverImages, hasSynced]);

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

  const handlePortfolioUpload = (files) => {
    portfolioUploadMutation.mutate(files);
  };

  const handleRemovePortfolioImage = (imageId) => {
    portfolioDeleteMutation.mutate(imageId);
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
      <div className="min-h-screen bg-gray-50 pt-[5px] pb-12">
        <div className="max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 shadow-sm border border-gray-100 mt-6 space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
              <p className="text-gray-600 mt-1">{t("subtitle")}</p>
            </div>

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
          </div>
        </div>
      </div>
    </>
  );
}
