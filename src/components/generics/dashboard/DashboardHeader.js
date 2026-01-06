"use client";
import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiController } from "@/utils/apiController";

export const DashboardHeader = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["headerProfile"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/braiders/profile/",
        token,
        requiresAuth: true,
      }).then((res) => res.data),
    enabled: !!token,
  });

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const displayName =
    profile?.business_name || profile?.display_name || "Braider";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Good morning, {displayName}! ☀️
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s what&apos;s happening in Berlin today, {formattedDate}.
        </p>
      </div>

      <div className="flex items-center mt-4 sm:mt-0">
        {isLoading ? (
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse border border-gray-300" />
        ) : profile?.business_logo_url ? (
          <div className="relative w-14 h-14">
            <Image
              src={profile.business_logo_url}
              alt="Profile"
              fill
              className="rounded-full border-2 border-[#b5734c] object-cover shadow-sm"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full border-2 border-[#b5734c] bg-[#b5734c]/10 flex items-center justify-center shadow-sm">
            <span className="text-[#b5734c] font-bold text-lg tracking-wider">
              {getInitials(displayName)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
