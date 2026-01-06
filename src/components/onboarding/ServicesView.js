"use client";

import React, { useState } from "react";
import { useRouter } from "@/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  ChevronLeft,
  Loader2,
  Trash2,
  Edit2,
  Clock,
  Euro,
} from "lucide-react";
import toast from "react-hot-toast";

import { apiController } from "@/utils/apiController";
import ProgressBar from "../generics/ProgressBar";
import Button from "../generics/ui/Button";
import ServiceModal from "./ServiceModal";

const CURRENT_STEP = 5;

export default function ServicesView() {
  const t = useTranslations("ServicesPricing");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const { data: profile } = useQuery({
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

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ["braiderServices"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/braiders/services/",
        requiresAuth: true,
        token: session?.accessToken,
      }).then((res) => res.data),
    enabled: !!session?.accessToken,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      apiController({
        method: "DELETE",
        url: `/braiders/services/${id}/`,
        requiresAuth: true,
        token: session?.accessToken,
      }),
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["braiderServices"] });
    },
    onError: () => toast.error(t("deleteError")),
  });

  const handleDelete = (id) => {
    if (window.confirm(t("confirmDelete"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleContinue = () => {
    if (!servicesData || servicesData.length === 0) {
      toast.error(t("atLeastOneService"));
      return;
    }
    router.push("/onboarding/payment");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-[80px] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#b5734c]" />
      </div>
    );
  }

  return (
    <>
      <ProgressBar currentStep={CURRENT_STEP} />
      <div className="min-h-screen bg-gray-50 pt-[80px] pb-12">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 shadow-sm border border-gray-100 mt-6 mb-6">
            <button
              onClick={() => router.push("/onboarding/portfolio")}
              className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              {tCommon("back")}
            </button>
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t("title")}
                </h1>
                <p className="text-gray-600 mt-1 max-w-xl">{t("subtitle")}</p>
              </div>
              <Button
                onClick={handleAddNew}
                icon={Plus}
                className="!w-auto px-6 shadow-lg shadow-orange-900/10"
              >
                {t("addService")}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {servicesData && servicesData.length > 0 ? (
              servicesData.map((service) => (
                <div
                  key={service.id}
                  className="bg-white border border-gray-200 p-5 hover:border-[#b5734c]/30 transition-all shadow-sm group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {service.skill_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                          <Euro className="w-4 h-4 text-gray-400" />
                          <span>{service.base_price}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{service.base_duration_minutes} min</span>
                        </div>
                        {service.variations?.length > 0 && (
                          <span className="text-xs text-gray-400">
                            +{service.variations.length} {t("variations")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-gray-400 hover:text-[#b5734c] hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-[#b5734c]" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {t("noServices")}
                </h3>
                <p className="text-gray-500 mt-1 mb-6">{t("noServicesDesc")}</p>
                <Button onClick={handleAddNew} className="!w-auto">
                  {t("addFirstService")}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleContinue} className="!w-auto px-12">
              {t("saveAndFinish")}
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          serviceToEdit={editingService}
          availableSkills={profile?.skills || []}
        />
      )}
    </>
  );
}
