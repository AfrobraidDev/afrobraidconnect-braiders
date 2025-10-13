"use client";
import React, { useState, useMemo } from "react";
import { Home, Building, Truck, ChevronLeft, Loader2 } from "lucide-react";
import ProgressBar from "../generics/ProgressBar";
import { useServiceTypes } from "@/hooks/onboarding/useServiceTypes";

const CURRENT_STEP = 3;

// Helper to map API data to the UI's needs (icons, descriptions)
const serviceTypeUIMap = {
  SHOP_BASED_SALON: {
    title: "Salon/Shop Owner",
    description: "I operate a braiding salon with multiple stylists.",
    icon: Building,
  },
  MOBILE_BASED_SALON: {
    title: "Mobile Braiding Service",
    description: "I travel to clients' locations to provide services.",
    icon: Truck,
  },
  HOME_BASED_SALON: {
    title: "Home-Based Salon",
    description: "I operate from a professional home studio.",
    icon: Home,
  },
};

const ServiceCard = ({ option, isSelected, onSelect }) => {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`
        flex flex-col items-start p-6 border h-full text-left
        transition-all duration-300 ease-in-out transform hover:-translate-y-1
        ${
          isSelected
            ? "border-orange-500 ring-2 ring-orange-400 bg-orange-50 shadow-lg"
            : "border-gray-200 hover:border-orange-400 hover:shadow-md bg-white"
        }
      `}
    >
      <Icon
        className={`w-7 h-7 mb-3 ${
          isSelected ? "text-black" : "text-gray-500"
        }`}
      />
      <h3 className="text-base font-bold text-gray-900 mb-1">{option.title}</h3>
      <p className="text-sm text-gray-600">{option.description}</p>
    </button>
  );
};

export default function ServiceTypeView({ onStepComplete, onBack }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const { serviceTypes, isLoading, isError, updateServiceTypes, isUpdating } =
    useServiceTypes();

  // Map API data to a format the UI can easily render
  const serviceOptions = useMemo(() => {
    if (!serviceTypes) return [];
    return serviceTypes.map((type) => ({
      id: type.id, // The UUID from the API
      ...serviceTypeUIMap[type.name], // Merges title, description, and icon
    }));
  }, [serviceTypes]);

  const handleSelectService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleContinue = () => {
    if (selectedServices.length === 0) return;

    updateServiceTypes(selectedServices, {
      onSuccess: () => {
        // This callback runs after the mutation's own onSuccess
        if (onStepComplete) {
          onStepComplete(selectedServices);
        }
      },
    });
  };

  const isContinueDisabled = selectedServices.length === 0 || isUpdating;

  // --- Render logic for loading and error states ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#b5734c]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: Could not load service types. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[80px] font-sans">
      <ProgressBar currentStep={CURRENT_STEP} />
      <div className="max-w-4xl w-full mx-auto p-4 sm:p-8">
        <div className="mb-10">
          <button
            onClick={onBack}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              What type of service do you provide?
            </h2>
            <p className="text-lg text-gray-600">
              Choose all that apply to you. This helps us tailor your
              experience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {serviceOptions.map((option) => (
            <ServiceCard
              key={option.id}
              option={option}
              isSelected={selectedServices.includes(option.id)}
              onSelect={handleSelectService}
            />
          ))}
        </div>

        <button
          onClick={handleContinue}
          type="button"
          disabled={isContinueDisabled}
          className={`
            w-full py-4 text-white font-bold text-medium shadow-md transition duration-200 flex justify-center items-center
            ${
              isContinueDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#b5734c] hover:bg-[#c2825d]"
            }
          `}
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}
