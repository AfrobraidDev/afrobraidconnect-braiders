"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, User, Mail } from "lucide-react";
import { apiController } from "@/utils/apiController";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "BRAIDER",
    password: "",
    confirm_password: "",
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

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await apiController({
        method: "POST",
        url: "/auth/register/",
        data: formData,
      });
      setSuccessMessage(
        "Registration successful! Please check your email to verify your account."
      );
    } catch (err) {
      setError(err.detail || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Create an Account
          </h1>
          <p className="mt-2 text-gray-600">Join AfroBraid Connect today!</p>
        </div>

        {successMessage ? (
          <div className="p-4 text-center text-green-800 bg-green-100 border border-green-200 rounded-lg">
            <p>{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                icon={<User />}
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <InputField
                icon={<User />}
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <InputField
              icon={<Mail />}
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              icon={<Lock />}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputField
              icon={<Lock />}
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />

            {error && (
              <p className="text-sm text-center text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

const InputField = ({ icon, ...props }) => (
  <div>
    <label htmlFor={props.name} className="sr-only">
      {props.placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon && <div className="w-5 h-5 text-gray-400">{icon}</div>}
      </div>
      <input
        id={props.name}
        className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        {...props}
      />
    </div>
  </div>
);
