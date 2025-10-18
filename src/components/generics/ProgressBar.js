"use client";

import React from "react";
import { ChevronRight } from "lucide-react"; // Use a cleaner arrow icon

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
const Steps = ({ currentStep }) => {
  // Find the label for the current step
  const currentStepLabel = steps[currentStep - 1] || 'Start';

  return (
    // Responsive Container: Flex column on mobile, center items
    <div className="flex flex-col sm:flex-row items-center justify-center w-full px-4 sm:px-6">

      {/* --- Mobile/Small Screen View (Show Current Step Only) --- */}
      <div className="sm:hidden text-center text-sm font-semibold text-gray-700">
        Step {currentStep} of {steps.length}: <span className="text-[#d3986a]">{currentStepLabel}</span>
      </div>

      {/* --- Tablet/Desktop View (Show Full Steps) --- */}
      <div className="hidden sm:flex justify-center items-center flex-wrap max-w-4xl w-full">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          // Determine text and circle styling
          const textStyle = isCompleted
            ? "text-gray-900" // Completed steps are dark
            : isActive 
            ? "font-bold text-[#d3986a]" // Active step is bold and orange
            : "text-gray-500"; // Future steps are muted

          const circleBg = isCompleted
            ? "bg-gray-500 text-white" // Completed circle is filled gray
            : isActive
            ? "bg-[#d3986a] text-white" // Active circle is filled orange
            : "bg-transparent text-gray-500 border border-gray-400";

          return (
            <React.Fragment key={step}>
              <div
                className={`flex items-center text-sm ${textStyle} mx-1 whitespace-nowrap`}
                // Added flex-shrink-0 to prevent items from scrunching up
              >
                {/* Step Number Circle */}
                <span
                  className={`w-6 h-6 rounded-full flex justify-center items-center mr-1 text-xs font-bold transition duration-200 ${circleBg}`}
                >
                  {stepNumber}
                </span>
                {/* The step name */}
                <span className="hidden md:inline-block">{step}</span>
                {/* Abbreviate text on small tablets */}
                <span className="inline-block md:hidden text-xs">
                    {step.split(' ').map(word => word[0]).join('')} 
                </span>
              </div>

              {/* Arrow Separator (not after the last step) */}
              {index < steps.length - 1 && (
                <div className="text-gray-400 mx-1 flex items-center">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default function ProgressBar({ currentStep = 1 }) {
  return (
    // Header Wrapper: Fixed position, white background, shadow
    <div className="fixed top-0 left-0 w-full z-10 flex items-center justify-center py-4 sm:py-5 border-b border-gray-200 bg-white shadow-sm">
      <Logo />
      <Steps currentStep={currentStep} />
    </div>
  );
}