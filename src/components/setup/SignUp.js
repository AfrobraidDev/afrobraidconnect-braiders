"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiController } from "@/utils/apiController";
import { PhoneInput } from "react-international-phone";
import {
  Lock,
  Eye,
  EyeOff,
  User,
  Mail,
  ChevronLeft,
  Globe,
  ChevronDown,
} from "lucide-react";

// --- Custom Input Field Component (No changes here) ---
const InputField = ({ icon, label, ...props }) => {
  const isPassword = 
    props.name === "password" || props.name === "confirm_password";
  
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={props.name} className="block text-gray-900 mb-1 text-sm font-medium">
        {label}*
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </div>
        )}

        <input
          id={props.name}
          className={`
            w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 
            focus:outline-none focus:ring-1 focus:ring-[#b47550] focus:border-[#b47550] transition
            ${icon ? "pl-10" : "pl-4"}
          `}
          {...props}
          type={isPassword && !showPassword ? "password" : props.type}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default function SignupForm({ onBack }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "BRAIDER",
    password: "",
    confirm_password: "",
  });
  const [phone, setPhone] = useState("");
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
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT COLUMN: FORM AREA */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16 relative">
        
        {/* --- MOVED HEADER INSIDE THIS COLUMN --- */}
        <header className="relative w-full -top-10 -left-10">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm inline-flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        </header>

        {/* Form Content Wrapper */}
        <main className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full py-6">
          {/* Header Text */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create an Account</h1>
            <p className="text-gray-600 text-sm">Join AfroBraid Connect today!</p>
          </div>

          {/* Form */}
          {successMessage ? (
            <div className="p-4 text-center text-green-800 bg-green-100 border border-green-200 rounded-lg">
              <p>{successMessage}</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    icon={<User className="w-5 h-5 text-gray-400" />}
                    type="text"
                    name="first_name"
                    placeholder="James"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Last Name"
                    icon={<User className="w-5 h-5 text-gray-400" />}
                    type="text"
                    name="last_name"
                    placeholder="Brown"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                
                <InputField
                  label="Email Address"
                  icon={<Mail className="w-5 h-5 text-gray-400" />}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />

                <InputField
                  label="Create a Password"
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />

                <InputField
                  label="Confirm Password"
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm password"
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                />

                {/* Phone Number */}
                <div>
                  <label className="block text-gray-900 mb-1 text-sm font-medium">Phone Number*</label>
                  <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-[#b47550] transition h-[48px] overflow-hidden">
                    <PhoneInput
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      defaultCountry="de"
                      inputClassName="w-full h-full text-gray-900 outline-none border-none py-3" 
                      countrySelectorStyleProps={{
                        showFlags: true,
                        showCountryCode: true,
                        showCountryName: false,
                        buttonStyle: { border: 'none', background: 'transparent', paddingLeft: '10px' } 
                      }}
                      placeholder="(555) 000-0000"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-[#b47550] text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Finish Set Up"}
                </button>
              </form>

              <div className="text-center mt-6 text-sm text-gray-500">
                By signing up, you agree to accept Afro Connect&apos;s
                <Link href="/terms" className="text-gray-700 font-medium ml-1 hover:underline">
                  Terms and Conditions
                </Link>
              </div>
            </>
          )} 
        </main>

        {/* Footer Links */}
        <footer className="mt-12 flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-50 sm:border-none">
          <div className="flex items-center space-x-1">
            <a href="mailto:support@afrobraidconnect.com" className="flex items-center hover:text-gray-700 transition">
              <Mail className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">support@afrobraidconnect.com</span>
              <span className="sm:hidden">Support</span>
            </a>
          </div>
          <div className="flex items-center space-x-1 hover:text-gray-700 cursor-pointer">
            <Globe className="w-4 h-4" />
            <span className="font-bold">ENG</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </footer>
      </div>

      {/* Right Image Panel */}
      <div className="relative w-1/2 bg-gray-200 hidden md:block">
        <Image 
          src="/images/customer2.jpg" 
          alt="Customer booking appointment" 
          fill 
          priority 
          className="object-cover" 
          sizes="(max-width: 768px) 0vw, 50vw" 
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div> 
    </div>
  );
}