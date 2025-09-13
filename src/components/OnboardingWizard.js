// src/app/components/OnboardingWizard.js
"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, XCircle } from "lucide-react";

// A reusable component for each step in the wizard
const OnboardingStep = ({
  title,
  description,
  isComplete,
  isDeclined,
  href,
}) => {
  const getIcon = () => {
    if (isComplete) return <CheckCircle2 className="text-green-500" />;
    if (isDeclined) return <XCircle className="text-red-500" />;
    return <Circle className="text-gray-300" />;
  };

  return (
    <div
      className={`p-4 rounded-lg flex items-center justify-between ${
        isComplete
          ? "bg-green-50 border-l-4 border-green-500"
          : "bg-white border"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {!isComplete && (
        <Link href={href}>
          <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            <span>{isDeclined ? "Try Again" : "Start"}</span>
            <ArrowRight size={16} />
          </button>
        </Link>
      )}
    </div>
  );
};

export default function OnboardingWizard({ profile }) {
  if (!profile) return null;

  const steps = [
    {
      title: "Verify Phone Number",
      description: "Confirm your phone number to accept bookings.",
      isComplete: profile.is_phone_verified,
      isDeclined: false, // You can add a status for this if needed
      href: "/profile/verify-phone", // We will create this page next
    },
    {
      title: "Verify Your Identity",
      description: "Upload a valid ID to build trust with customers.",
      isComplete: profile.document_verification_status === "VERIFIED",
      isDeclined: profile.document_verification_status === "DECLINED",
      href: "/profile/verify", // This is the document verification page
    },
    {
      title: "Add Your Skills",
      description: "Detail your braiding skills and specialties.",
      isComplete: false, // Replace with logic from profile
      isDeclined: false,
      href: "/profile/skills",
    },
    {
      title: "Upload Your Portfolio",
      description: "Showcase at least 3 examples of your work.",
      isComplete: false, // Replace with logic from profile
      isDeclined: false,
      href: "/profile/portfolio",
    },
    {
      title: "Set Up Payments",
      description: "Connect with Stripe to receive payments.",
      isComplete: false, // Replace with logic from profile
      isDeclined: false,
      href: "/profile/payments",
    },
  ];

  const completedSteps = steps.filter((step) => step.isComplete).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Complete Your Setup
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Finish these steps to get verified and start accepting jobs on Afrobraid
        Connect.
      </p>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            Profile Completion
          </span>
          <span className="text-sm font-medium text-gray-700">
            {completedSteps} of {steps.length} complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Steps Checklist */}
      <div className="mt-6 space-y-4">
        {steps.map((step) => (
          <OnboardingStep key={step.title} {...step} />
        ))}
      </div>
    </div>
  );
}
