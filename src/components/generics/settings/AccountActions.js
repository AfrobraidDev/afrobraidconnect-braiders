import React from "react";
import { useSettings } from "@/components/dashboard/hooks/useSettings";
import { AlertTriangle, Power, Trash2 } from "lucide-react";

export const AccountActions = ({ profile }) => {
  const { performAccountAction, isPerformingAction } = useSettings();

  const handleDeactivate = () => {
    if (
      window.confirm(
        "Are you sure you want to deactivate? Your profile will be hidden."
      )
    ) {
      performAccountAction({ type: "deactivate" });
    }
  };

  const handleReactivate = () => {
    performAccountAction({ type: "reactivate" });
  };

  const handleDelete = () => {
    const confirm = window.prompt(
      "Type 'DELETE' to permanently delete your account."
    );
    if (confirm === "DELETE") {
      performAccountAction({ type: "delete" });
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Account Management</h2>
        <p className="text-sm text-gray-500">
          Manage your account visibility and ownership.
        </p>
      </div>

      {/* Deactivate Zone */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-start gap-4">
        <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
          <Power size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Deactivate Account</h3>
          <p className="text-sm text-gray-600 mt-1 mb-3">
            Temporarily hide your profile from search results. You can
            reactivate it anytime by logging back in.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeactivate}
              disabled={isPerformingAction}
              className="text-sm font-medium px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Deactivate
            </button>
            <button
              onClick={handleReactivate}
              disabled={isPerformingAction}
              className="text-sm font-medium px-4 py-2 bg-theme-primary text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Reactivate
            </button>
          </div>
        </div>
      </div>

      {/* Delete Zone */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-start gap-4">
        <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900">Delete Account</h3>
          <p className="text-sm text-red-700 mt-1 mb-3">
            Permanently remove your account and all data. This action cannot be
            undone.
          </p>
          <button
            onClick={handleDelete}
            disabled={isPerformingAction}
            className="text-sm font-medium px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};
