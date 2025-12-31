"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Clock,
  Save,
  Copy,
  AlertCircle,
  CalendarCheck,
  Loader2,
  Power,
} from "lucide-react";

import { apiController } from "@/utils/apiController";
import Button from "../generics/ui/Button";
import Input from "../generics/ui/Input";

const DAYS_OF_WEEK = [
  { id: 0, label: "Monday" },
  { id: 1, label: "Tuesday" },
  { id: 2, label: "Wednesday" },
  { id: 3, label: "Thursday" },
  { id: 4, label: "Friday" },
  { id: 5, label: "Saturday" },
  { id: 6, label: "Sunday" },
];

const DEFAULT_SLOT = {
  start_time: "09:00",
  end_time: "17:00",
  is_active: true,
};

const generateComparisonString = (slots) => {
  if (!slots) return "";

  let flatList = [];
  if (Array.isArray(slots)) {
    flatList = slots.map((s) => ({
      d: s.day_of_week,
      s: s.start_time.slice(0, 5),
      e: s.end_time.slice(0, 5),
      a: s.is_active !== false,
    }));
  } else {
    Object.keys(slots).forEach((dayId) => {
      slots[dayId].forEach((s) => {
        flatList.push({
          d: parseInt(dayId),
          s: s.start_time,
          e: s.end_time,
          a: s.is_active,
        });
      });
    });
  }

  flatList.sort((a, b) => {
    if (a.d !== b.d) return a.d - b.d;
    return a.s.localeCompare(b.s);
  });

  return JSON.stringify(flatList);
};

export default function AvailabilitySettings() {
  const t = useTranslations("Availability");
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [scheduleMap, setScheduleMap] = useState({});

  const { data: serverData, isLoading } = useQuery({
    queryKey: ["availability"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/braiders/profile/schedule/",
        requiresAuth: true,
        token: session?.accessToken,
      }).then((res) => res.data || []),
    enabled: !!session?.accessToken,
  });

  useEffect(() => {
    if (serverData) {
      const newMap = {};
      DAYS_OF_WEEK.forEach((day) => {
        newMap[day.id] = [];
      });

      serverData.forEach((slot) => {
        if (!newMap[slot.day_of_week]) newMap[slot.day_of_week] = [];
        newMap[slot.day_of_week].push({
          ...slot,
          start_time: slot.start_time.slice(0, 5),
          end_time: slot.end_time.slice(0, 5),
          is_active: slot.is_active !== false,
        });
      });

      setScheduleMap(newMap);
    }
  }, [serverData]);

  const isDirty = useMemo(() => {
    if (isLoading || !serverData) return false;
    const currentString = generateComparisonString(scheduleMap);
    const serverString = generateComparisonString(serverData);
    return currentString !== serverString;
  }, [scheduleMap, serverData, isLoading]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      return apiController({
        method: "POST",
        url: "/braiders/profile/schedule/",
        data: payload,
        requiresAuth: true,
        token: session.accessToken,
      });
    },
    onSuccess: () => {
      toast.success(t("toastSaveSuccess"));
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
    onError: (err) => {
      toast.error(err.message || t("toastSaveError"));
    },
  });

  const handleUpdateSlot = (dayId, index, field, value) => {
    const updatedDaySlots = [...scheduleMap[dayId]];
    updatedDaySlots[index] = { ...updatedDaySlots[index], [field]: value };
    setScheduleMap((prev) => ({ ...prev, [dayId]: updatedDaySlots }));
  };

  const handleToggleSlotActive = (dayId, index) => {
    const updatedDaySlots = [...scheduleMap[dayId]];
    updatedDaySlots[index] = {
      ...updatedDaySlots[index],
      is_active: !updatedDaySlots[index].is_active,
    };
    setScheduleMap((prev) => ({ ...prev, [dayId]: updatedDaySlots }));
  };

  const handleAddSlot = (dayId) => {
    const currentSlots = scheduleMap[dayId] || [];
    setScheduleMap((prev) => ({
      ...prev,
      [dayId]: [...currentSlots, { ...DEFAULT_SLOT }],
    }));
  };

  const handleRemoveSlot = (dayId, index) => {
    const currentSlots = [...scheduleMap[dayId]];
    currentSlots.splice(index, 1);
    setScheduleMap((prev) => ({ ...prev, [dayId]: currentSlots }));
  };

  const handleToggleDay = (dayId, isActive) => {
    if (isActive) {
      handleAddSlot(dayId);
    } else {
      setScheduleMap((prev) => ({ ...prev, [dayId]: [] }));
    }
  };

  const handleCopyToAll = () => {
    const mondaySlots = scheduleMap[0] || [];
    if (mondaySlots.length === 0) return toast(t("toastCopyError"));

    const newMap = { ...scheduleMap };
    DAYS_OF_WEEK.forEach((day) => {
      if (day.id !== 0) {
        newMap[day.id] = JSON.parse(JSON.stringify(mondaySlots)).map((s) => ({
          ...s,
          day_of_week: day.id,
        }));
      }
    });

    setScheduleMap(newMap);
    toast.success(t("toastCopySuccess"));
  };

  const handleSave = () => {
    if (!isDirty) return;

    let isValid = true;
    const flatSlots = [];

    Object.keys(scheduleMap).forEach((dayId) => {
      scheduleMap[dayId].forEach((slot) => {
        if (slot.start_time >= slot.end_time) {
          isValid = false;
        }
        flatSlots.push({
          day_of_week: parseInt(dayId),
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_active: slot.is_active,
        });
      });
    });

    if (!isValid) {
      toast.error(t("validationError"));
      return;
    }

    mutation.mutate({ slots: flatSlots });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-[#b5734c] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 pb-24 sm:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarCheck className="text-[#b5734c] w-6 h-6" /> {t("title")}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
          <Button
            onClick={handleCopyToAll}
            variant="outline"
            icon={Copy}
            className="!w-full sm:!w-auto"
          >
            <span className="truncate">{t("btnCopy")}</span>
          </Button>

          <Button
            onClick={handleSave}
            isLoading={mutation.isPending}
            disabled={!isDirty}
            icon={Save}
            className={`!w-full sm:!w-auto transition-all ${
              !isDirty ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {t("btnSave")}
          </Button>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {DAYS_OF_WEEK.map((day) => {
          const daySlots = scheduleMap[day.id] || [];
          const isDayActive = daySlots.length > 0;

          return (
            <div
              key={day.id}
              className={`
                border rounded-xl transition-all duration-300 overflow-hidden
                ${
                  isDayActive
                    ? "border-gray-200 shadow-sm bg-white"
                    : "border-gray-100 bg-gray-50/50"
                }
              `}
            >
              <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-start gap-3 sm:gap-8">
                <div className="flex items-center justify-between lg:w-48 flex-shrink-0 pt-1">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isDayActive}
                        onChange={(e) =>
                          handleToggleDay(day.id, e.target.checked)
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b5734c]"></div>
                    </label>
                    <span
                      className={`font-semibold text-base ${
                        isDayActive ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {t(`days.${day.label}`)}
                    </span>
                  </div>

                  {isDayActive && (
                    <div className="lg:hidden">
                      <Button
                        onClick={() => handleAddSlot(day.id)}
                        className="!p-2 !w-8 !h-8 !rounded-full !bg-orange-50 !text-[#b5734c] hover:!bg-orange-100 border-none"
                      >
                        <Plus size={18} />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex-grow space-y-3 pt-2 lg:pt-0">
                  {!isDayActive ? (
                    <div className="text-sm text-gray-400 italic pl-1">
                      {t("unavailable")}
                    </div>
                  ) : (
                    <>
                      {daySlots.map((slot, index) => {
                        const isInvalid = slot.start_time >= slot.end_time;
                        const opacityClass = slot.is_active
                          ? "opacity-100"
                          : "opacity-60 grayscale";

                        return (
                          <div
                            key={index}
                            className={`flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 animate-in fade-in slide-in-from-left-2 duration-200 ${opacityClass}`}
                          >
                            <div className="grid grid-cols-[1fr_auto_1fr] sm:flex items-center gap-2 w-full sm:w-auto flex-1">
                              <div className="w-full sm:w-36">
                                <Input
                                  type="time"
                                  icon={Clock}
                                  value={slot.start_time}
                                  onChange={(e) =>
                                    handleUpdateSlot(
                                      day.id,
                                      index,
                                      "start_time",
                                      e.target.value
                                    )
                                  }
                                  disabled={!slot.is_active}
                                  className="!py-2"
                                />
                              </div>

                              <span className="text-gray-400 font-medium text-center">
                                -
                              </span>
                              <div className="w-full sm:w-36">
                                <Input
                                  type="time"
                                  value={slot.end_time}
                                  onChange={(e) =>
                                    handleUpdateSlot(
                                      day.id,
                                      index,
                                      "end_time",
                                      e.target.value
                                    )
                                  }
                                  disabled={!slot.is_active}
                                  className="!py-2"
                                  error={isInvalid && slot.is_active ? " " : ""}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                              {isInvalid && slot.is_active && (
                                <span className="text-red-500 text-xs flex items-center mr-auto sm:mr-0">
                                  <AlertCircle size={14} className="mr-1" />
                                  <span className="sm:hidden">
                                    {t("invalidTime")}
                                  </span>
                                </span>
                              )}

                              <button
                                onClick={() =>
                                  handleToggleSlotActive(day.id, index)
                                }
                                className={`
                                    p-2.5 rounded-lg transition-colors border
                                    ${
                                      slot.is_active
                                        ? "text-green-600 bg-green-50 border-green-100 hover:bg-green-100"
                                        : "text-gray-400 bg-gray-50 border-gray-200 hover:bg-gray-100"
                                    }
                                  `}
                                title={
                                  slot.is_active
                                    ? "Break / Inactive"
                                    : "Activate"
                                }
                              >
                                <Power size={18} />
                              </button>

                              <button
                                onClick={() => handleRemoveSlot(day.id, index)}
                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors"
                                title="Remove slot"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <div className="hidden lg:block mt-2">
                        <Button
                          onClick={() => handleAddSlot(day.id)}
                          variant="ghost"
                          icon={Plus}
                          className="!text-[#b5734c] hover:!text-[#a06240] !p-0 !h-auto"
                        >
                          {t("btnAddSlot")}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-700">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-1">{t("infoTitle")}</span>
          <p className="leading-relaxed">{t("infoDesc")}</p>
        </div>
      </div>
    </div>
  );
}
