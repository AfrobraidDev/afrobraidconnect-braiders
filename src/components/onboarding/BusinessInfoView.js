"use client";
import React, { useState } from "react";
import { User, Info } from "lucide-react";
import ProgressBar from "../generics/ProgressBar";
import PhoneVerificationView from "./PhoneVerificationView";

const MAX_CHARACTERS = 200;
const CURRENT_STEP = 1;

export default function BusinessInfoView({ onContinue }) {
  const [subStep, setSubStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    displayName: "",
    clientDescription: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "clientDescription" && value.length > MAX_CHARACTERS) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubStep(2);
  };

  const handlePhoneVerify = (phoneData) => {
    const finalData = { ...formData, ...phoneData}
    if (onContinue) {
      onContinue(finalData); 
    }
  };

  const handleBack = () => {
    setSubStep(1); 
  };

  // The entire view wrapper: full height, white background, and padding for the fixed header
  return (
    <>
      <ProgressBar currentStep={CURRENT_STEP} />
      <div className="min-h-screen bg-white pt-[80px]">
        {/* Content Container (Acts as the invisible card): Centered, max-width, responsive padding */}
        {subStep === 1 && (
          <div className="max-w-[700px] w-full mx-auto p-4 sm:p-8 lg:p-10">
            {/* Title Section */}
            <div className="mb-4 text-left">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Tell us more about your business!
              </h2>
              <p className="text-base text-gray-600">
                We would like to know more about your business
              </p>
            </div>

            {/* Divider Line */}
            <hr className="border-gray-200 mb-6" />

            {/* Form - Removed extra padding/background to align with the title section */}
            <form onSubmit={handleSubmit}>
              {/* Business Name Field */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
              </div>

              {/* Display Name Field */}
              <div className="mb-6">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  Display Name{" "}
                  <span className="text-gray-400 font-normal ml-2">
                    <Info size={16} className="text-gray-700" />
                  </span>
                </label>
                <div className="flex items-center border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300">
                  <User className="w-5 h-5 text-gray-500 mx-3" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="flex-grow p-3 border-none outline-none text-gray-900 bg-transparent"
                  />
                </div>
              </div>

              {/* Tell clients about yourself Field (Textarea) */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tell clients about yourself{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="clientDescription"
                  value={formData.clientDescription}
                  onChange={handleChange}
                  placeholder="Share your experience, specialties, and what makes your service unique"
                  maxLength={MAX_CHARACTERS}
                  required
                  className="w-full p-3 border border-gray-300 min-h-[120px] resize-y text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                ></textarea>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.clientDescription.length}/{MAX_CHARACTERS}
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                // Using CSS variable defined in global.css
                className="w-full py-4 mt-6 bg-[#b5734c] text-white font-bold text-lg shadow-md hover:bg-[#c2825d] transition duration-200"
              >
                Continue
              </button>
            </form>
          </div>
        )}
        {/* CONDITIONAL RENDERING: Display Phone Verification View */}
        {subStep === 2 && (
          <PhoneVerificationView 
            onVerify={handlePhoneVerify} // Submits to the parent to trigger external onContinue
            onBack={handleBack}        // Sets subStep back to 1
          />
        )}
      </div>
    </>
  );
}
