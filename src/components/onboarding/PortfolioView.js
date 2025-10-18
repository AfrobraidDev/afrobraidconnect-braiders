"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  UploadCloud,
  X,
  Image as ImageIcon,
  Building,
  ChevronDown,
  Check,
} from "lucide-react";
import ProgressBar from "../generics/ProgressBar";
import Image from "next/image";

const allSkills = [
  "Box Braids",
  "Knotless Braids",
  "Cornrows",
  "Ghana Weaving",
  "Faux Locs",
  "Dreadlocks",
  "Twists",
  "Natural Hair Styling",
  "Weave Install",
  "Wig Making",
  "Hair Treatment",
  "Kids Hairstyles",
];

const CURRENT_STEP = 4;

// --- REUSABLE IMAGE UPLOADER COMPONENT ---
const ImageUploader = ({ title, Icon, shape = "square", onFileChange }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      if (onFileChange) {
        onFileChange(file);
      }
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  return (
    <div className="flex items-center space-x-4">
      <div
        className={`flex-shrink-0 bg-gray-100 border-2 border-dashed rounded-${
          shape === "circle" ? "full" : "lg"
        } w-24 h-24 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors`}
        onClick={triggerFileSelect}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={500}
            height={500}
            className={`w-full h-full object-cover rounded-${
              shape === "circle" ? "full" : "lg"
            }`}
          />
        ) : (
          <div className="text-center">
            <Icon className="mx-auto h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h3 className="text-md font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">Click icon to upload</p>
        <button
          type="button"
          onClick={triggerFileSelect}
          className="text-sm font-semibold text-[#b5734c] hover:underline"
        >
          {preview ? "Change Photo" : "Upload Photo"}
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default function PortfolioView({ onStepComplete, onBack }) {
  // State for all form fields
  const [businessLogo, setBusinessLogo] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [workPhotos, setWorkPhotos] = useState([]);
  const [workPhotoPreviews, setWorkPhotoPreviews] = useState([]);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const dropdownRef = useRef(null);

  // Form validation
  useEffect(() => {
    const isValid = businessLogo !== null && workPhotos.length > 0;
    setIsFormValid(isValid);
  }, [businessLogo, workPhotos]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSkillsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleWorkPhotosChange = (event) => {
    const files = Array.from(event.target.files).slice(
      0,
      10 - workPhotos.length
    ); // Limit to 10 total
    if (files.length === 0) return;

    setWorkPhotos((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setWorkPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeWorkPhoto = (indexToRemove) => {
    URL.revokeObjectURL(workPhotoPreviews[indexToRemove]);
    setWorkPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
    setWorkPhotoPreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => prev.filter((s) => s !== skill));
    } else if (selectedSkills.length < 6) {
      setSelectedSkills((prev) => [...prev, skill]);
    } else {
      alert("You can select up to 6 skills only.");
    }
  };

  const handleContinue = () => {
    if (!isFormValid) {
      alert(
        "Please upload a profile picture and at least one photo of your work."
      );
      return;
    }
    const portfolioData = {
      businessLogo: businessLogo ? businessLogo.name : null,
      skills: selectedSkills,
      workPhotos: workPhotos.map((file) => file.name),
    };
    onStepComplete(portfolioData);
  };

  return (
    <div className="min-h-screen bg-white pt-[80px] font-sans">
      <ProgressBar currentStep={CURRENT_STEP} />
      <div className="max-w-[700px] w-full mx-auto p-4 sm:p-8 lg:p-10">
        <button
          onClick={onBack}
          className="absolute top-24 left-4 sm:left-8 flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <div className="mb-4 mt-12 sm:mt-0 text-left">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Build Your Portfolio
          </h2>
          <p className="text-base text-gray-600">
            This information will be displayed on your public profile to attract
            clients.
          </p>
        </div>

        <hr className="mb-8 border-gray-200" />

        <div className="space-y-8">
          {/* --- Profile Picture & Logo Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader
              title="Business Logo*"
              Icon={ImageIcon}
              shape="circle"
              onFileChange={setBusinessLogo}
            />
          </div>

          {/* --- Skills Section --- */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Skills (Select up to 6)
            </label>
            <button
              type="button"
              onClick={() => setIsSkillsOpen(!isSkillsOpen)}
              className="w-full flex justify-between items-center p-3 border border-gray-300 bg-white text-left"
            >
              <span className="text-gray-900">
                {selectedSkills.length > 0
                  ? `${selectedSkills.length} skills selected`
                  : "Select your skills"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isSkillsOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {isSkillsOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
                {allSkills.map((skill) => (
                  <div
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <span className="text-black">{skill}</span>
                    {selectedSkills.includes(skill) && (
                      <Check className="w-5 h-5 text-[#b5734c]" />
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Selected skills tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-1 rounded-full"
                >
                  {skill}
                  <button
                    onClick={() => toggleSkill(skill)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* --- Previous Work Photos --- */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Photos of Previous Work*
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100">
              <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> (up to 10
                images)
              </p>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleWorkPhotosChange}
              />
            </label>
            {/* Previews */}
            {workPhotoPreviews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                {workPhotoPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={preview}
                      alt={`Work sample ${index + 1}`}
                      width={500}
                      height={500}
                      className="w-full h-28 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeWorkPhoto(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`w-full py-3 mt-10 font-bold text-medium shadow-md transition ${
            isFormValid
              ? "bg-[#b5734c] text-white hover:bg-[#c2825d]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Finish Onboarding
        </button>
      </div>
    </div>
  );
}
