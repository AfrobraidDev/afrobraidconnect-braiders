"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ImageUploader({
  images = [],
  onUpload,
  onRemove,
  multiple = false,
  isLoading = false,
  label,
  description,
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length > 0) {
      onUpload(multiple ? validFiles : validFiles[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">{label}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed p-8 transition-all duration-200 ease-in-out text-center cursor-pointer
          ${
            dragActive
              ? "border-[#b5734c] bg-orange-50"
              : "border-gray-300 hover:border-[#b5734c] hover:bg-gray-50"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />

        {isLoading ? (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="w-10 h-10 text-[#b5734c] animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-medium">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div className="p-4 bg-orange-100 rounded-full mb-3 text-[#b5734c]">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              Click to upload{" "}
              <span className="font-normal text-gray-500">
                or drag and drop
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              SVG, PNG, JPG (max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div
          className={`grid gap-4 ${
            multiple
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              : "grid-cols-1 w-full max-w-[200px]"
          }`}
        >
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              className="group relative aspect-square overflow-hidden border border-gray-200 bg-gray-100"
            >
              <Image
                src={
                  typeof img === "string"
                    ? img
                    : img.image_url || img.url || URL.createObjectURL(img)
                }
                alt="Upload preview"
                fill
                className="object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(img.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-gray-600 hover:text-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
