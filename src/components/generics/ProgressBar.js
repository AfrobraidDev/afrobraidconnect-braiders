"use client";

import React, { useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Check, X, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function ProgressBar({ currentStep = 1 }) {
  const t = useTranslations("ProgressBar");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const steps = [
    { label: t("businessInfo"), path: "/onboarding/business-info" },
    { label: t("identity"), path: "/onboarding/identity" },
    { label: t("services"), path: "/onboarding/services" },
    { label: t("portfolio"), path: "/onboarding/portfolio" },
    { label: t("payment"), path: "/onboarding/payment" },
  ];

  const currentStepLabel = steps[currentStep - 1]?.label;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-[80px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-full gap-4 sm:gap-8">
            <div className="flex-shrink-0 w-[120px] sm:w-[140px] flex items-center z-10">
              <Link
                href="/"
                className="relative h-10 w-32 block transition-opacity hover:opacity-80"
              >
                <Image
                  src="/logo/logo.webp"
                  alt="AfroBraidConnect"
                  fill
                  className="object-contain object-left"
                  priority
                  sizes="130px"
                />
              </Link>
            </div>

            <nav className="flex justify-center min-w-0 w-full">
              <div className="hidden md:block w-full overflow-x-auto no-scrollbar">
                <ul className="flex items-center justify-start lg:justify-center space-x-1 lg:space-x-4 min-w-max px-4">
                  {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                      <React.Fragment key={step.path}>
                        <li>
                          <Link
                            href={step.path}
                            className={`
                              group flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-300
                              ${
                                isActive
                                  ? "bg-orange-50 ring-1 ring-orange-100"
                                  : "hover:bg-gray-50"
                              }
                            `}
                          >
                            <div
                              className={`
                                flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold transition-all duration-300 flex-shrink-0
                                ${
                                  isCompleted
                                    ? "bg-[#b5734c] text-white"
                                    : isActive
                                    ? "bg-white border-2 border-[#b5734c] text-[#b5734c]"
                                    : "bg-gray-100 text-gray-400 border border-gray-200 group-hover:border-gray-300"
                                }
                            `}
                            >
                              {isCompleted ? (
                                <Check size={14} strokeWidth={3} />
                              ) : (
                                stepNumber
                              )}
                            </div>
                            <span
                              className={`
                                hidden lg:block text-sm font-medium whitespace-nowrap transition-colors
                                ${
                                  isActive
                                    ? "text-[#b5734c]"
                                    : isCompleted
                                    ? "text-gray-900"
                                    : "text-gray-400"
                                }
                            `}
                            >
                              {step.label}
                            </span>
                          </Link>
                        </li>
                        {index < steps.length - 1 && (
                          <li
                            className={`
                              hidden sm:block w-4 lg:w-8 h-[2px] rounded-full transition-colors duration-300 flex-shrink-0
                              ${isCompleted ? "bg-[#b5734c]/30" : "bg-gray-100"}
                          `}
                            aria-hidden="true"
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </ul>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden flex flex-col items-center group active:scale-95 transition-transform"
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  Step {currentStep} of {steps.length}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                    {currentStepLabel}
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-gray-400 group-hover:text-[#b5734c] transition-colors"
                  />
                </div>
              </button>
            </nav>

            <div className="flex-shrink-0 w-[80px] sm:w-[140px] flex justify-end z-10">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors"
              >
                <span className="mr-2 hidden sm:inline">Save & Exit</span>
                <div className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <X size={14} />
                </div>
              </Link>
              <Link href="/dashboard" className="sm:hidden p-2 text-gray-400">
                <X size={20} />
              </Link>
            </div>
          </div>

          <div className="md:hidden absolute bottom-0 left-0 w-full h-[2px] bg-gray-100">
            <div
              className="h-full bg-[#b5734c] transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 w-full bg-white shadow-xl overflow-hidden animate-in slide-in-from-top-10 duration-300">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Your Progress
                </h3>
                <p className="text-xs text-gray-500">
                  {Math.round(((currentStep - 1) / steps.length) * 100)}%
                  Complete
                </p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1">
                {steps.map((step, index) => {
                  const stepNumber = index + 1;
                  const isActive = stepNumber === currentStep;
                  const isCompleted = stepNumber < currentStep;

                  return (
                    <Link
                      key={step.path}
                      href={step.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                                    flex items-center justify-between p-4 transition-all duration-200
                                    ${
                                      isActive
                                        ? "bg-orange-50 border border-orange-100"
                                        : "hover:bg-gray-50 border border-transparent"
                                    }
                                `}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                                        flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold
                                        ${
                                          isCompleted
                                            ? "bg-[#b5734c] text-white"
                                            : isActive
                                            ? "bg-white border-2 border-[#b5734c] text-[#b5734c]"
                                            : "bg-gray-100 text-gray-400"
                                        }
                                    `}
                        >
                          {isCompleted ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            stepNumber
                          )}
                        </div>
                        <span
                          className={`font-medium ${
                            isActive
                              ? "text-[#b5734c]"
                              : isCompleted
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>

                      {isActive && (
                        <ChevronRight size={16} className="text-[#b5734c]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <Link
                href="/dashboard"
                className="flex w-full items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50"
              >
                Save & Exit
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
