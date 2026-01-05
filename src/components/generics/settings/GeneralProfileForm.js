import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Save, Loader2 } from "lucide-react";
import { useSettings } from "@/components/dashboard/hooks/useSettings";
import Input from "@/components/generics/ui/Input";
import Button from "@/components/generics/ui/Button";

export const GeneralProfileForm = ({ profile }) => {
  const { updateProfile, uploadLogo, isUpdatingProfile, isUploadingLogo } =
    useSettings();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    business_name: profile?.business_name || "",
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadLogo(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">General Profile</h2>
        <p className="text-sm text-gray-500">
          Update your public business information.
        </p>
      </div>

      {/* Logo Upload Section */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full border-2 border-gray-100 overflow-hidden bg-gray-50 relative">
            {profile?.business_logo_url || isUploadingLogo ? (
              <Image
                src={profile?.business_logo_url || "/placeholder.png"}
                alt="Logo"
                fill
                className={`object-cover ${
                  isUploadingLogo ? "opacity-50" : ""
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-2xl">
                {formData.business_name?.[0]}
              </div>
            )}

            {/* Loading Spinner for Logo */}
            {isUploadingLogo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-theme-primary" />
              </div>
            )}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 text-gray-600 transition-all"
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Business Logo</h3>
          <p className="text-xs text-gray-500 max-w-xs mt-1">
            Recommended 500x500px. Supports PNG, JPG.
          </p>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Text Fields */}
      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Business Name"
            value={formData.business_name}
            onChange={(e) =>
              setFormData({ ...formData, business_name: e.target.value })
            }
          />
          <Input
            label="Display Name"
            value={formData.display_name}
            onChange={(e) =>
              setFormData({ ...formData, display_name: e.target.value })
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary min-h-[120px] text-sm"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell clients about your experience..."
          />
          <p className="text-xs text-gray-400 text-right">
            {formData.bio.length}/500
          </p>
        </div>

        <Button type="submit" isLoading={isUpdatingProfile} icon={Save}>
          Save Changes
        </Button>
      </form>
    </div>
  );
};
