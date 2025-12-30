"use client";

import React from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

const Logo = () => (
  <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2">
    <span className="text-2xl font-bold text-[#b5734c]">AC</span>
  </div>
);

export default function ProgressBar({ currentStep = 1 }) {
  const t = useTranslations("ProgressBar");

  const steps = [
    { label: t("businessInfo"), path: "/onboarding/business-info" },
    { label: t("identity"), path: "/onboarding/identity" },
    { label: t("services"), path: "/onboarding/services" },
    { label: t("portfolio"), path: "/onboarding/portfolio" },
    { label: t("payment"), path: "/onboarding/payment" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm h-[80px]">
      <div className="relative w-full h-full flex items-center justify-center px-4">
        <Logo />

        <nav className="w-full max-w-5xl overflow-x-auto no-scrollbar flex items-center lg:justify-center">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-max px-2">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <React.Fragment key={step.path}>
                  <Link
                    href={step.path}
                    className={`
                      group flex items-center space-x-2 py-2 px-2 transition-all duration-200
                      ${isActive ? "bg-orange-50" : "hover:bg-gray-50"}
                    `}
                  >
                    <div
                      className={`
                        relative flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 border-2
                        ${
                          isCompleted
                            ? "bg-[#b5734c] border-[#b5734c] text-white"
                            : isActive
                            ? "border-[#b5734c] text-[#b5734c] bg-white"
                            : "border-gray-200 text-gray-400 bg-white group-hover:border-gray-300"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check size={14} strokeWidth={3} />
                      ) : (
                        <span>{stepNumber}</span>
                      )}
                    </div>

                    <span
                      className={`
                        whitespace-nowrap text-sm font-medium transition-colors duration-200
                        ${
                          isActive || isCompleted
                            ? "text-gray-900"
                            : "text-gray-500 group-hover:text-gray-700"
                        }
                      `}
                    >
                      {step.label}
                    </span>
                  </Link>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        hidden sm:block h-[2px] w-8 rounded-full mx-2
                        ${isCompleted ? "bg-[#b5734c]" : "bg-gray-200"}
                      `}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
