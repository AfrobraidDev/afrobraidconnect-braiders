"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, X, Loader2 } from "lucide-react";
import { apiController } from "@/utils/apiController";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function SkillSelector({ selectedSkills, onChange }) {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDesc, setNewSkillDesc] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await apiController({
          method: "GET",
          url: "/admin/braiding-skills/",
          params: { search: query, page_size: 5 },
          requiresAuth: true,
          token: session?.accessToken,
        });
        setResults(res.data?.results || []);
      } catch (err) {
        console.error("Skill search error", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, session]);

  const addSkill = (skill) => {
    if (!selectedSkills.find((s) => s.id === skill.id)) {
      onChange([...selectedSkills, skill]);
    }
    setQuery("");
    setResults([]);
  };

  const removeSkill = (skillId) => {
    onChange(selectedSkills.filter((s) => s.id !== skillId));
  };

  const handleSuggestSkill = async (e) => {
    e.preventDefault();
    setIsSuggesting(true);
    try {
      const res = await apiController({
        method: "POST",
        url: "/braiders/skills/suggest/",
        data: { name: newSkillName, description: newSkillDesc },
        requiresAuth: true,
        token: session?.accessToken,
      });

      if (res) {
        toast.success("Skill suggested successfully!");
        onChange([...selectedSkills, res]);
        setShowSuggestModal(false);
        setNewSkillName("");
        setNewSkillDesc("");
      }
    } catch (err) {
      toast.error("Failed to suggest skill.");
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-[#b5734c] focus:border-[#b5734c] outline-none text-gray-900"
            placeholder="Search for skills (e.g. Microlocs)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>

        {/* Dropdown Results */}
        {results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
            {results.map((skill) => (
              <button
                key={skill.id}
                onClick={() => addSkill(skill)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex flex-col border-b border-gray-50 last:border-0"
              >
                <span className="font-medium text-gray-900">{skill.name}</span>
                {skill.description && (
                  <span className="text-xs text-gray-500">
                    {skill.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* "Not found" Suggestion Trigger */}
        {query.length > 2 && results.length === 0 && !isSearching && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-lg p-3 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Can&apos;t find &quot;{query}&quot;?
            </p>
            <button
              type="button"
              onClick={() => {
                setNewSkillName(query);
                setShowSuggestModal(true);
                setQuery("");
              }}
              className="text-sm font-semibold text-[#b5734c] hover:underline"
            >
              + Suggest as a new skill
            </button>
          </div>
        )}
      </div>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center bg-orange-50 text-orange-900 px-3 py-1.5 rounded-full text-sm font-medium border border-orange-100"
          >
            {skill.name}
            <button
              onClick={() => removeSkill(skill.id)}
              className="ml-2 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Suggest Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Suggest New Skill
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Help us grow our list! Your suggestion will be reviewed.
            </p>

            <form onSubmit={handleSuggestSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
                </label>
                <input
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full p-2 border border-gray-300 focus:border-[#b5734c] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                  className="w-full p-2 border border-gray-300 focus:border-[#b5734c] outline-none h-20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuggestModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSuggesting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#b5734c] hover:bg-[#a66540] disabled:opacity-70"
                >
                  {isSuggesting ? "Submitting..." : "Submit Suggestion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
