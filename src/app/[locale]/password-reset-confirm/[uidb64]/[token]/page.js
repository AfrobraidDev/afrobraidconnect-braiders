"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { apiController } from "@/utils/apiController";

export default function ResetPasswordConfirmPage({ params }) {
  const { uidb64, token } = params;
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await apiController({
        method: "PATCH",
        url: "/auth/password-reset-complete/",
        data: { ...formData, uidb64, token },
      });
      setSuccessMessage(
        "Your password has been reset successfully! You can now log in."
      );
      // Optional: redirect after a delay
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(
        err.detail ||
          "Failed to reset password. The link may be invalid or expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Set New Password</h1>
          <p className="mt-2 text-gray-600">
            Please enter your new password below.
          </p>
        </div>

        {successMessage ? (
          <div className="p-4 text-center text-green-800 bg-green-100 border border-green-200 rounded-lg">
            <p>{successMessage}</p>
            <Link
              href="/login"
              className="block mt-2 font-bold text-indigo-600 hover:underline"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="New Password"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password2" className="sr-only">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  required
                  value={formData.password2}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm New Password"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-center text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
