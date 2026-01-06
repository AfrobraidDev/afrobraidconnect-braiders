import React, { useState } from "react";
import { Check, X, Lock } from "lucide-react";
import { useSettings } from "@/components/dashboard/hooks/useSettings";
import Input from "@/components/generics/ui/Input";
import Button from "@/components/generics/ui/Button";

export const SecurityForm = () => {
  const { changePassword, isChangingPassword } = useSettings();

  const [passData, setPassData] = useState({
    old_password: "",
    new_password: "",
    confirm: "",
  });

  const isFilled =
    passData.old_password.length > 0 &&
    passData.new_password.length > 0 &&
    passData.confirm.length > 0;

  const doPasswordsMatch =
    passData.new_password &&
    passData.confirm &&
    passData.new_password === passData.confirm;

  const showMismatchError =
    passData.confirm.length > 0 && passData.new_password !== passData.confirm;

  const isFormValid = isFilled && doPasswordsMatch;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    changePassword(
      {
        old_password: passData.old_password,
        new_password: passData.new_password,
      },
      {
        onSuccess: () => {
          setPassData({ old_password: "", new_password: "", confirm: "" });
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-lg animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
          <Lock size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Security</h2>
          <p className="text-sm text-gray-500">
            Manage your password and account security.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="password"
          label="Current Password"
          placeholder="Enter current password"
          value={passData.old_password}
          onChange={(e) =>
            setPassData({ ...passData, old_password: e.target.value })
          }
        />

        <div className="border-t border-gray-100 my-2 pt-2 space-y-5">
          <Input
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={passData.new_password}
            onChange={(e) =>
              setPassData({ ...passData, new_password: e.target.value })
            }
          />

          <div className="relative">
            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Repeat new password"
              value={passData.confirm}
              onChange={(e) =>
                setPassData({ ...passData, confirm: e.target.value })
              }
              className={
                doPasswordsMatch
                  ? "!border-green-500 !ring-green-100"
                  : showMismatchError
                  ? "!border-red-300 !ring-red-100"
                  : ""
              }
            />
            <div className="absolute right-3 top-[38px] transition-all duration-300">
              {doPasswordsMatch && (
                <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <Check size={12} /> Match
                </div>
              )}
              {showMismatchError && (
                <div className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  <X size={12} /> Mismatch
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            isLoading={isChangingPassword}
            disabled={!isFormValid || isChangingPassword}
            className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};
