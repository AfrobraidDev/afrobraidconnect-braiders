import React, { useState } from "react";
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
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passData.new_password !== passData.confirm) {
      setError("New passwords do not match.");
      return;
    }
    setError("");
    changePassword({
      old_password: passData.old_password,
      new_password: passData.new_password,
    });
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Security</h2>
        <p className="text-sm text-gray-500">
          Manage your password and account security.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          label="Current Password"
          value={passData.old_password}
          onChange={(e) =>
            setPassData({ ...passData, old_password: e.target.value })
          }
        />
        <hr className="border-gray-100 my-2" />
        <Input
          type="password"
          label="New Password"
          value={passData.new_password}
          onChange={(e) =>
            setPassData({ ...passData, new_password: e.target.value })
          }
        />
        <Input
          type="password"
          label="Confirm New Password"
          value={passData.confirm}
          onChange={(e) =>
            setPassData({ ...passData, confirm: e.target.value })
          }
          error={error}
        />

        <div className="pt-2">
          <Button type="submit" isLoading={isChangingPassword}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};
