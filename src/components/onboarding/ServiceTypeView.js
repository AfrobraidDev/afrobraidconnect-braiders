"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "@/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Store,
  Home,
  Car,
  MapPin,
  ChevronLeft,
  ShieldCheck,
  Info,
  CheckCircle2,
  Circle as CircleIcon,
  Map as MapIcon,
  List as ListIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import { apiController } from "@/utils/apiController";
import ProgressBar from "../generics/ProgressBar";
import Button from "../generics/ui/Button";
import LocationInput from "../generics/ui/LocationInput";

const MapPreview = dynamic(() => import("../generics/ui/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
      Loading Map...
    </div>
  ),
});

const CURRENT_STEP = 3;

export default function ServiceTypeView() {
  const t = useTranslations("Services");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [selectedTypeIds, setSelectedTypeIds] = useState([]);
  const [locations, setLocations] = useState({});
  const [initialData, setInitialData] = useState({ ids: [], locations: {} });
  const [activeMapId, setActiveMapId] = useState(null);
  const [mobileView, setMobileView] = useState("list");

  const [hasSynced, setHasSynced] = useState(false);

  const { data: serviceTypes = [], isLoading: loadingTypes } = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/braiders/service-types/",
        requiresAuth: true,
        token: session?.accessToken,
      }).then((res) => res.data || []),
    enabled: !!session?.accessToken,
    staleTime: 1000 * 60 * 10,
  });

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

  const { data: locationsData = [], isLoading: loadingLocs } = useQuery({
    queryKey: ["braiderLocations"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/braiders/profile/locations/",
        requiresAuth: true,
        token: session?.accessToken,
      }).then((res) => res.data || []),
    enabled: !!session?.accessToken,
  });

  const isLoading = loadingTypes || loadingProfile || loadingLocs;

  useEffect(() => {
    if (!isLoading && serviceTypes.length > 0 && !hasSynced) {
      const existingIds = (profile?.service_types || []).map((t) => t.id);
      setSelectedTypeIds(existingIds);

      const locMap = {};
      locationsData.forEach((loc) => {
        const matchingType = serviceTypes.find(
          (t) => t.name === loc.service_type_name
        );
        if (matchingType) {
          locMap[matchingType.id] = {
            address: loc.address,
            city: loc.city,
            country: loc.country,
            latitude: parseFloat(loc.latitude),
            longitude: parseFloat(loc.longitude),
            radius_km: loc.radius_km || "",
          };
        }
      });

      setLocations(locMap);

      setInitialData({
        ids: existingIds,
        locations: JSON.parse(JSON.stringify(locMap)),
      });

      if (existingIds.length > 0) setActiveMapId(existingIds[0]);
      setHasSynced(true);
    }
  }, [isLoading, serviceTypes, profile, locationsData, hasSynced]);

  const mutation = useMutation({
    mutationFn: async () => {
      const sortedCurrentIds = [...selectedTypeIds].sort();
      const sortedInitialIds = [...initialData.ids].sort();

      if (
        JSON.stringify(sortedCurrentIds) !== JSON.stringify(sortedInitialIds)
      ) {
        await apiController({
          method: "PATCH",
          url: "/braiders/profile/service-types/",
          data: { service_types: selectedTypeIds },
          requiresAuth: true,
          token: session.accessToken,
        });
      }

      const locationPayload = selectedTypeIds.map((id) => ({
        service_type_id: id,
        ...locations[id],
        radius_km: locations[id].radius_km
          ? parseInt(locations[id].radius_km)
          : 30,
      }));

      if (locationPayload.length > 0) {
        await apiController({
          method: "POST",
          url: "/braiders/profile/locations/",
          data: locationPayload,
          requiresAuth: true,
          token: session.accessToken,
        });
      }

      const idsToRemove = initialData.ids.filter(
        (id) => !selectedTypeIds.includes(id)
      );

      if (idsToRemove.length > 0) {
        await Promise.all(
          idsToRemove.map((id) =>
            apiController({
              method: "DELETE",
              url: `/braiders/profile/locations/`,
              params: { service_type_id: id },
              requiresAuth: true,
              token: session.accessToken,
            })
          )
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["braiderProfile"] });
      queryClient.invalidateQueries({ queryKey: ["braiderLocations"] });
      toast.success("Service settings saved!");
      router.push("/onboarding/portfolio");
    },
    onError: (error) => {
      console.error("Submit Error", error);
      toast.error(error.message || "Failed to save changes.");
    },
  });

  const toggleType = (id) => {
    setSelectedTypeIds((prev) => {
      const newState = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      if (!prev.includes(id)) setActiveMapId(id);
      return newState;
    });
  };

  const handleLocationUpdate = (typeId, data) => {
    setLocations((prev) => ({
      ...prev,
      [typeId]: { ...prev[typeId], ...data },
    }));
    setActiveMapId(typeId);
  };

  const handleFocus = (typeId) => {
    setActiveMapId(typeId);
  };

  const hasChanges = useMemo(() => {
    if (isLoading) return false;
    const sortedCurrentIds = [...selectedTypeIds].sort();
    const sortedInitialIds = [...initialData.ids].sort();
    if (JSON.stringify(sortedCurrentIds) !== JSON.stringify(sortedInitialIds))
      return true;

    for (const id of selectedTypeIds) {
      const initLoc = initialData.locations[id] || {};
      const currLoc = locations[id] || {};
      if (
        currLoc.address !== initLoc.address ||
        currLoc.latitude !== initLoc.latitude ||
        String(currLoc.radius_km || "") !== String(initLoc.radius_km || "")
      ) {
        return true;
      }
    }
    return false;
  }, [selectedTypeIds, locations, initialData, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) {
      router.push("/onboarding/portfolio");
      return;
    }

    for (const id of selectedTypeIds) {
      if (!locations[id]?.address || !locations[id]?.latitude) {
        toast.error("Please enter a valid location for all selected services.");
        return;
      }
    }

    mutation.mutate();
  };

  const getTypeMeta = (name) => {
    switch (name) {
      case "HOME_BASED":
        return {
          icon: Home,
          label: t("homeBasedTitle"),
          desc: t("homeBasedDesc"),
          warning: t("homeBasedWarning"),
        };
      case "SHOP_BASED":
        return {
          icon: Store,
          label: t("shopBasedTitle"),
          desc: t("shopBasedDesc"),
        };
      case "MOBILE_BASED":
        return {
          icon: Car,
          label: t("mobileBasedTitle"),
          desc: t("mobileBasedDesc"),
        };
      case "INDIVIDUAL_BASED":
        return {
          icon: Car,
          label: t("individualBasedTitle"),
          desc: t("individualBasedDesc"),
        };
      case "AREA_BASED":
        return {
          icon: Car,
          label: t("areaBasedTitle"),
          desc: t("areaBasedDesc"),
        };
      default:
        return { icon: MapPin, label: name, desc: "" };
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen pt-[80px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b5734c]"></div>
      </div>
    );

  return (
    <>
      <ProgressBar currentStep={CURRENT_STEP} />

      <div className="min-h-screen bg-gray-50 pt-[80px] pb-12 relative">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 mt-6">
            <div
              className={`w-full lg:w-1/2 space-y-6 ${
                mobileView === "map" ? "hidden lg:block" : "block"
              }`}
            >
              <div className="bg-white p-6 shadow-sm border border-gray-100">
                <button
                  onClick={() => router.push("/onboarding/identity")}
                  className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
                >
                  <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
                  {tCommon("back")}
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t("title")}
                </h1>
                <p className="text-gray-600 mt-1">{t("subtitle")}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {serviceTypes.map((type) => {
                  const isSelected = selectedTypeIds.includes(type.id);
                  const meta = getTypeMeta(type.name);
                  const Icon = meta.icon;
                  const isMapActive = activeMapId === type.id;

                  return (
                    <div
                      key={type.id}
                      onClick={() => handleFocus(type.id)}
                      className={`
                        bg-white transition-all duration-300 overflow-hidden 
                        ${
                          isSelected
                            ? "shadow-md"
                            : "border border-gray-200 hover:border-gray-300 shadow-sm"
                        }
                        ${
                          isMapActive && isSelected
                            ? "ring-2 ring-[#b5734c]"
                            : ""
                        } 
                      `}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleType(type.id);
                        }}
                        className="flex items-center p-5 cursor-pointer select-none"
                      >
                        <div
                          className={`p-3 rounded-xl mr-4 transition-colors ${
                            isSelected
                              ? "bg-[#b5734c] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} />
                        </div>
                        <div className="flex-grow">
                          <h3
                            className={`font-semibold text-lg ${
                              isSelected ? "text-[#b5734c]" : "text-gray-900"
                            }`}
                          >
                            {meta.label}
                          </h3>
                          <p className="text-sm text-gray-500">{meta.desc}</p>
                        </div>
                        <div
                          className={`transition-all duration-300 ${
                            isSelected
                              ? "text-[#b5734c] scale-110"
                              : "text-gray-300"
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle2
                              size={26}
                              fill="currentColor"
                              className="text-white"
                            />
                          ) : (
                            <CircleIcon size={26} />
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="px-5 pb-6 pt-0 animate-in slide-in-from-top-4 fade-in duration-300">
                          <hr className="border-gray-100 mb-5" />

                          {meta.warning && (
                            <div className="flex items-start bg-green-50 text-green-800 p-4 rounded-xl mb-5 text-sm border border-green-100">
                              <ShieldCheck className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold block mb-1">
                                  Privacy Protected
                                </span>
                                {meta.warning}
                              </div>
                            </div>
                          )}

                          <div className="space-y-4">
                            <div onClick={() => handleFocus(type.id)}>
                              <LocationInput
                                label={t("locationLabel")}
                                value={locations[type.id]?.address || ""}
                                onChange={(e) =>
                                  handleLocationUpdate(type.id, {
                                    address: e.target.value,
                                  })
                                }
                                onLocationSelect={(data) =>
                                  handleLocationUpdate(type.id, data)
                                }
                                placeholder={t("addressPlaceholder")}
                              />
                            </div>

                            <div className="flex gap-4">
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block tracking-wide">
                                  {t("cityLabel")}
                                </label>
                                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium">
                                  {locations[type.id]?.city || "—"}
                                </div>
                              </div>
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block tracking-wide">
                                  {t("countryLabel")}
                                </label>
                                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium">
                                  {locations[type.id]?.country || "—"}
                                </div>
                              </div>
                            </div>

                            <div
                              className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                              onClick={() => handleFocus(type.id)}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center">
                                  <Info size={14} className="mr-2" />
                                  {t("radiusLabel")}
                                </label>
                                <span className="text-sm font-bold text-[#b5734c]">
                                  {locations[type.id]?.radius_km || 30} km
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="100"
                                step="1"
                                value={locations[type.id]?.radius_km || 30}
                                onChange={(e) =>
                                  handleLocationUpdate(type.id, {
                                    radius_km: e.target.value,
                                  })
                                }
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#b5734c]"
                              />
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                Drag to adjust your service coverage area
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-end pt-6 pb-20 lg:pb-0">
                  <Button
                    type="submit"
                    isLoading={mutation.isPending}
                    className="!w-auto px-12 shadow-lg shadow-orange-900/10"
                  >
                    {tCommon("continue")}
                  </Button>
                </div>
              </form>
            </div>

            <div
              className={`w-full lg:w-1/2 ${
                mobileView === "list"
                  ? "hidden lg:block"
                  : "block h-[calc(100vh-100px)] lg:h-auto"
              }`}
            >
              <div className="sticky top-[100px] h-full lg:h-[calc(100vh-140px)] bg-white shadow-xl border border-gray-100 overflow-hidden">
                <MapPreview locations={locations} activeId={activeMapId} />

                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 text-xs text-gray-600 shadow-sm border border-gray-100 flex justify-around pointer-events-none">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#b5734c] mr-2"></span>{" "}
                    Active Location
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>{" "}
                    Other Locations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden">
          <button
            onClick={() =>
              setMobileView(mobileView === "list" ? "map" : "list")
            }
            className="flex items-center gap-2 bg-[#2d2d2d] text-white px-6 py-3 rounded-full shadow-xl font-semibold text-sm hover:scale-105 transition-transform"
          >
            {mobileView === "list" ? (
              <>
                Show Map <MapIcon size={16} />
              </>
            ) : (
              <>
                Show List <ListIcon size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
