"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, MapPin, Building, Hash, Globe } from "lucide-react";
import ProgressBar from "../generics/ProgressBar";

const CURRENT_STEP = 3;

// Reusable input component for consistency
const AddressInput = ({
  icon: Icon,
  placeholder,
  value,
  onChange,
  name,
  required = true,
}) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
      {placeholder}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex items-center border border-gray-300 bg-white overflow-hidden focus:border-none focus-within:ring-2 focus-within:ring-orange-300 focus-within:ring-orange-300">
      <Icon className="text-gray-500 w-5 h-5 ml-3 mr-2 flex-shrink-0" />
      <input
        type="text"
        name={name}
        placeholder={`Enter ${placeholder.toLowerCase()}`}
        value={value}
        onChange={onChange}
        className="flex-grow p-3 border-none outline-none text-gray-900 placeholder-gray-400"
      />
    </div>
  </div>
);

export default function AddressView({ onStepComplete, onBack }) {
  // State for each part of the address
  const [streetAddress, setStreetAddress] = useState("");
  const [aptSuite, setAptSuite] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Effect to validate the form whenever a required field changes
  useEffect(() => {
    const isValid =
      streetAddress.trim().length > 0 &&
      city.trim().length > 0 &&
      state.trim().length > 0 &&
      zipCode.trim().length > 0;
    setIsFormValid(isValid);
  }, [streetAddress, city, state, zipCode]);

  const handleContinue = () => {
    if (!isFormValid) {
      console.warn("Please fill in all required address fields.");
      return;
    }

    const formData = {
      street: streetAddress,
      aptSuite: aptSuite,
      city: city,
      state: state,
      zipCode: zipCode,
    };

    console.log("Address Data Collected:", formData);

    if (onStepComplete) {
      onStepComplete(formData);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[80px] font-sans">
      <ProgressBar currentStep={CURRENT_STEP} />
      <div className="max-w-[700px] w-full mx-auto p-4 sm:p-8 lg:p-10">
        <button
          onClick={onBack}
          className="absolute top-24 left-4 sm:left-8 flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="mb-4 mt-12 sm:mt-0 text-left">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Confirm your business location
          </h2>
          <p className="text-base text-gray-600">
            This address will be shown on your profile.
          </p>
        </div>

        <hr className="mb-8 border-gray-200" />

        {/* Address Form Fields */}
        <div className="space-y-6">
          <AddressInput
            icon={MapPin}
            placeholder="Street Address"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            name="streetAddress"
          />
          <AddressInput
            icon={Building}
            placeholder="Apt, Suite, etc."
            value={aptSuite}
            onChange={(e) => setAptSuite(e.target.value)}
            name="aptSuite"
            required={false}
          />

          {/* Grid for City, State, and ZIP for a cleaner layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddressInput
              icon={Globe}
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              name="city"
            />
            <AddressInput
              icon={Globe}
              placeholder="State / Province"
              value={state}
              onChange={(e) => setState(e.target.value)}
              name="state"
            />
          </div>
          <AddressInput
            icon={Hash}
            placeholder="ZIP / Postal Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            name="zipCode"
          />
        </div>

        <button
          onClick={handleContinue}
          type="button"
          disabled={!isFormValid}
          className={`w-full py-3 mt-8 font-bold text-medium shadow-md transition duration-200 ${
            isFormValid
              ? "bg-[#b5734c] text-white hover:bg-[#c2825d]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
}
