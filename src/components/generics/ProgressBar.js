"use client";

import React from "react";

const steps = [
  "Business Information",
  "Identity Verification",
  "Services",
  "Portfolio",
  "Payment",
];

const Logo = () => (
  // Logo styling: fixed position, large orange font
  <div className="text-[28px] font-bold text-[#d3986a] absolute left-4 lg:left-10 top-1/2 -translate-y-1/2">
    afrB
  </div>
);

// Component to render the step navigation
const Steps = ({ currentStep }) => (
  <div className="flex justify-center items-center flex-wrap max-w-4xl w-full px-4 sm:px-6">
    {steps.map((step, index) => {
      const stepNumber = index + 1;
      const isActive = stepNumber === currentStep;
      const isCompleted = stepNumber < currentStep;

      // Determine text and circle styling
      const textStyle =
        isActive || isCompleted ? "font-bold text-gray-900" : "text-gray-500";
      const circleBg = isActive
        ? "bg-[#d3986a] text-white"
        : "bg-transparent text-gray-500 border border-gray-400";

      return (
        <React.Fragment key={step}>
          <div
            className={`flex items-center whitespace-nowrap text-sm ${textStyle} mx-1`}
          >
            {/* Step Number Circle */}
            <span
              className={`w-[18px] h-[18px] rounded-full flex justify-center items-center mr-2 text-[10px] font-bold ${circleBg}`}
            >
              {stepNumber}
            </span>
            {step}
          </div>

          {/* Arrow Separator (not after the last step) */}
          {index < steps.length - 1 && (
            <div className="text-gray-400 mx-2 text-sm hidden sm:block">
              {">"}
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default function ProgressBar({ currentStep = 1 }) {
  return (
    // Header Wrapper: Fixed position, white background, shadow
    <div className="fixed top-0 left-0 w-full z-10 flex items-center justify-center py-5 border-b border-gray-200 bg-white shadow-sm">
      <Logo />
      <Steps currentStep={currentStep} />
    </div>
  );
}
