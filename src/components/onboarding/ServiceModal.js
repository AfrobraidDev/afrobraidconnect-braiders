"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { X, Plus, Trash2, Loader2, ChevronDown, Check } from "lucide-react";
import toast from "react-hot-toast";
import { apiController } from "@/utils/apiController";

export default function ServiceModal({
  isOpen,
  onClose,
  serviceToEdit,
  availableSkills,
}) {
  const t = useTranslations("ServiceModal");
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [skillId, setSkillId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [variations, setVariations] = useState([]);

  useEffect(() => {
    if (serviceToEdit) {
      setSkillId(serviceToEdit.braiding_skill_id);
      setBasePrice(serviceToEdit.base_price);
      setDuration(serviceToEdit.base_duration_minutes);
      setDescription(serviceToEdit.description);
      setVariations(serviceToEdit.variations || []);
    } else {
      setSkillId(availableSkills.length > 0 ? availableSkills[0].id : "");
      setBasePrice("");
      setDuration("");
      setDescription("");
      setVariations([]);
    }
  }, [serviceToEdit, availableSkills, isOpen]);

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        name: "",
        category: "LENGTH",
        price_adjustment: "",
        duration_adjustment: 0,
      },
    ]);
  };

  const updateVariation = (index, field, value) => {
    const updated = [...variations];
    updated[index][field] = value;
    setVariations(updated);
  };

  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (serviceToEdit) {
        return apiController({
          method: "PATCH",
          url: `/braiders/services/${serviceToEdit.id}/`,
          data,
          requiresAuth: true,
          token: session?.accessToken,
        });
      } else {
        return apiController({
          method: "POST",
          url: "/braiders/services/",
          data,
          requiresAuth: true,
          token: session?.accessToken,
        });
      }
    },
    onSuccess: () => {
      toast.success(serviceToEdit ? t("updatedSuccess") : t("createdSuccess"));
      queryClient.invalidateQueries({ queryKey: ["braiderServices"] });
      onClose();
    },
    onError: (err) => {
      console.error(err);
      toast.error(t("errorOccurred"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      braiding_skill_id: skillId,
      base_price: parseFloat(basePrice),
      base_duration_minutes: parseInt(duration),
      description,
      is_active: true,
      variations: variations.map((v) => ({
        ...v,
        price_adjustment: parseFloat(v.price_adjustment || 0),
        duration_adjustment: parseInt(v.duration_adjustment || 0),
      })),
    };

    mutation.mutate(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">
            {serviceToEdit ? t("editService") : t("newService")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                {t("skillLabel")}
              </label>
              <div className="relative">
                <select
                  value={skillId}
                  onChange={(e) => setSkillId(e.target.value)}
                  disabled={availableSkills.length === 0}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 pr-8 outline-none focus:ring-2 focus:ring-[#b5734c]/20 focus:border-[#b5734c] transition-all"
                >
                  {availableSkills.length === 0 && (
                    <option>{t("noSkillsFound")}</option>
                  )}
                  {availableSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
              </div>
              {availableSkills.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  {t("addSkillsWarning")}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                {t("priceLabel")}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  €
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#b5734c] focus:ring-2 focus:ring-[#b5734c]/20 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                {t("durationLabel")}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#b5734c] focus:ring-2 focus:ring-[#b5734c]/20 transition-all"
                  placeholder="120"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  min
                </span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                {t("descLabel")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[#b5734c] focus:ring-2 focus:ring-[#b5734c]/20 transition-all h-24 resize-none"
                placeholder={t("descPlaceholder")}
              />
            </div>
          </div>

          <hr className="border-gray-100" />
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">
                {t("variationsTitle")}
              </h3>
              <button
                type="button"
                onClick={addVariation}
                className="text-xs font-semibold text-[#b5734c] bg-orange-50 hover:bg-orange-100 px-3 py-1.5 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> {t("addVariation")}
              </button>
            </div>

            <div className="space-y-3">
              {variations.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 border border-dashed border-gray-200">
                  {t("noVariations")}
                </p>
              )}

              {variations.map((v, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-3 p-3 bg-gray-50 border border-gray-100 animate-in fade-in slide-in-from-left-2"
                >
                  <input
                    type="text"
                    placeholder={t("varNamePlaceholder")}
                    value={v.name}
                    onChange={(e) =>
                      updateVariation(index, "name", e.target.value)
                    }
                    className="flex-[2] px-3 py-2 bg-white border border-gray-200 text-sm outline-none focus:border-[#b5734c]"
                  />

                  <select
                    value={v.category}
                    onChange={(e) =>
                      updateVariation(index, "category", e.target.value)
                    }
                    className="flex-1 px-2 py-2 bg-white border border-gray-200 text-sm outline-none focus:border-[#b5734c]"
                  >
                    <option value="LENGTH">{t("catLength")}</option>
                    <option value="SIZE">{t("catSize")}</option>
                    <option value="ADDON">{t("catAddon")}</option>
                  </select>

                  <div className="flex-1 relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      €
                    </span>
                    <input
                      type="number"
                      placeholder="+ Price"
                      value={v.price_adjustment}
                      onChange={(e) =>
                        updateVariation(
                          index,
                          "price_adjustment",
                          e.target.value
                        )
                      }
                      className="w-full pl-5 pr-2 py-2 bg-white border border-gray-200 text-sm outline-none focus:border-[#b5734c]"
                    />
                  </div>

                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="+ Min"
                      value={v.duration_adjustment}
                      onChange={(e) =>
                        updateVariation(
                          index,
                          "duration_adjustment",
                          e.target.value
                        )
                      }
                      className="w-full pl-2 pr-8 py-2 bg-white border border-gray-200 text-sm outline-none focus:border-[#b5734c]"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      m
                    </span>
                  </div>

                  <button
                    onClick={() => removeVariation(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending || !skillId || !basePrice}
            className="px-8 py-2.5 text-sm font-semibold text-white bg-[#b5734c] hover:bg-[#9a6240] shadow-lg shadow-orange-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {serviceToEdit ? t("saveChanges") : t("createService")}
          </button>
        </div>
      </div>
    </div>
  );
}
