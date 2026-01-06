"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  ChevronDown,
  Plus,
} from "lucide-react";
import { apiController } from "@/utils/apiController";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function SkillSelector({ selectedSkills = [], onChange }) {
  const { data: session } = useSession();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasFetchedInitial, setHasFetchedInitial] = useState(false);

  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDesc, setNewSkillDesc] = useState("");
  const [newSkillImage, setNewSkillImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const shouldFetch =
      query.length > 0 || (isDropdownOpen && !hasFetchedInitial);

    if (!shouldFetch) return;

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiController({
          method: "GET",
          url: "/admin/braiding-skills/",
          params: { search: query, page_size: 20 },
          requiresAuth: true,
          token: session?.accessToken,
        });

        const allResults = res?.data?.results || [];
        setResults(allResults);

        if (query.length === 0) setHasFetchedInitial(true);
      } catch (err) {
        console.error("Skill search error", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, session, isDropdownOpen, hasFetchedInitial]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
    setIsDropdownOpen(true);
  };

  const addSkill = (skill) => {
    if (!skill || !skill.id) return;

    if (!selectedSkills.find((s) => s.id === skill.id)) {
      onChange([...selectedSkills, skill]);
    }
    setQuery("");
    inputRef.current?.focus();
  };

  const removeSkill = (e, skillId) => {
    e.stopPropagation();
    onChange(selectedSkills.filter((s) => s.id !== skillId));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && query === "" && selectedSkills.length > 0) {
      const newSkills = [...selectedSkills];
      newSkills.pop();
      onChange(newSkills);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSkillImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSuggestSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setIsSuggesting(true);
    try {
      const formData = new FormData();
      formData.append("name", newSkillName);
      formData.append("description", newSkillDesc);
      if (newSkillImage) {
        formData.append("image", newSkillImage);
      }

      const res = await apiController({
        method: "POST",
        url: "/braiders/skills/suggest/",
        data: formData,
        requiresAuth: true,
        token: session?.accessToken,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newSkill = res.data || res;

      if (newSkill && newSkill.id) {
        toast.success("Skill suggested!");
        onChange([...selectedSkills, newSkill]);

        setShowSuggestModal(false);
        setNewSkillName("");
        setNewSkillDesc("");
        setNewSkillImage(null);
        setImagePreview(null);
        setIsDropdownOpen(false);
      } else {
        console.warn("API did not return a valid ID for the new skill", res);
        toast.success("Skill suggested! Refreshing...");
        setHasFetchedInitial(false);
        setShowSuggestModal(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to suggest skill.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const availableOptions = results.filter(
    (r) => r.id && !selectedSkills.find((s) => s.id === r.id)
  );

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={handleContainerClick}
        className={`
            min-h-[56px] w-full bg-white border flex items-center flex-wrap gap-2 px-3 py-2 cursor-text transition-all shadow-sm
            ${
              isDropdownOpen
                ? "border-[#b5734c] ring-2 ring-[#b5734c]/20"
                : "border-gray-200 hover:border-gray-300"
            }
        `}
      >
        {selectedSkills.map((skill, index) => (
          <div
            key={skill.id || `selected-${index}`}
            className="group flex items-center pl-1 pr-2 py-1 bg-orange-50 border border-orange-100 rounded-full select-none animate-in fade-in zoom-in duration-200"
          >
            <div className="w-5 h-5 rounded-full bg-white relative overflow-hidden mr-2 border border-orange-100 flex-shrink-0">
              {skill.image_url ? (
                <Image
                  src={skill.image_url}
                  alt={skill.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-[9px] font-bold text-orange-300 uppercase">
                  {skill.name ? skill.name.charAt(0) : "?"}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-orange-900">
              {skill.name}
            </span>
            <button
              onClick={(e) => removeSkill(e, skill.id)}
              className="ml-1.5 p-0.5 rounded-full text-orange-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="text"
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400 h-8"
          placeholder={selectedSkills.length === 0 ? "Select skills..." : ""}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />

        <div className="flex items-center gap-2 pr-1 pointer-events-none">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#b5734c]" />
          ) : (
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {isDropdownOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 shadow-xl max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 scrollbar-thin scrollbar-thumb-gray-200">
          {availableOptions.length > 0 ? (
            <div className="py-2">
              {availableOptions.map((skill, index) => (
                <button
                  key={skill.id || `option-${index}`}
                  onClick={() => addSkill(skill)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50/50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-200 group-hover:border-orange-200 transition-colors">
                    {skill.image_url ? (
                      <Image
                        src={skill.image_url}
                        alt={skill.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="block font-medium text-gray-900 truncate">
                      {skill.name}
                    </span>
                    {skill.description && (
                      <span className="block text-xs text-gray-500 truncate">
                        {skill.description}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            !isSearching && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  {query ? `No match for "${query}"` : "Start typing to search"}
                </p>
                {query.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewSkillName(query);
                      setShowSuggestModal(true);
                      setIsDropdownOpen(false);
                      setQuery("");
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-[#b5734c] bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Suggest &quot;{query}&quot;
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}

      {showSuggestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowSuggestModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">
                Suggest New Skill
              </h3>
              <button
                onClick={() => setShowSuggestModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSuggestSkill} className="p-6 space-y-5">
              <div className="flex justify-center">
                <label className="relative cursor-pointer group">
                  <div
                    className={`
                        w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden
                        ${
                          imagePreview
                            ? "border-[#b5734c] bg-white"
                            : "border-gray-300 bg-gray-50 hover:border-[#b5734c] hover:bg-orange-50"
                        }
                    `}
                  >
                    {imagePreview ? (
                      <>
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <UploadCloud className="text-white w-6 h-6" />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-1 group-hover:text-[#b5734c] transition-colors" />
                        <span className="text-[10px] text-gray-500 font-medium">
                          Add Photo
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Skill Name
                  </label>
                  <input
                    required
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5734c]/20 focus:border-[#b5734c] outline-none transition-all font-medium"
                    placeholder="e.g. Boho Braids"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Description{" "}
                    <span className="text-gray-400 font-normal lowercase">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={newSkillDesc}
                    onChange={(e) => setNewSkillDesc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5734c]/20 focus:border-[#b5734c] outline-none transition-all resize-none h-24 text-sm"
                    placeholder="Briefly describe this style..."
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSuggestModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSuggesting || !newSkillName.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#b5734c] rounded-xl hover:bg-[#9a6240] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-orange-900/10 transition-all flex items-center justify-center gap-2"
                >
                  {isSuggesting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>Submit Suggestion</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
