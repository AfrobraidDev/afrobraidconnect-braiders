// src/views/PhoneVerificationView.js
"use client";
import React, { useState, useEffect } from "react";
import { Phone, Lock, Loader2, CheckCircle, XCircle } from "lucide-react";
import { usePhoneVerification } from '@/hooks/onboarding/usePhoneVerification'; // Adjust path as needed

export default function PhoneVerificationView({ onVerify, onBack }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [viewError, setViewError] = useState(""); // Local state for input validation/general errors

  // Consume the custom hook
  const { 
    request, 
    confirm, 
    isLoading,
    isRequestSuccessful, // True if the code has been successfully requested
    isVerificationSuccessful // True if the code has been successfully confirmed
  } = usePhoneVerification();

  const isCodeSent = isRequestSuccessful || confirm.isIdle === false || confirm.isError;
  const isVerified = isVerificationSuccessful;
  
  // Handle API errors from the hook
  useEffect(() => {
    if (request.isError) {
        setViewError(request.error?.message || "Failed to send code. Please check your network.");
    } else if (confirm.isError) {
        setViewError(confirm.error?.message || "Verification failed. Check the code.");
    } else {
        // Clear API error when successful or starting new process
        setViewError("");
    }
  }, [request.isError, confirm.isError, request.error, confirm.error]);

  // Handle successful verification completion
  useEffect(() => {
      if (isVerificationSuccessful && onVerify) {
          // Notify the parent component of success
          onVerify({ phoneNumber, isVerified: true });
      }
  }, [isVerificationSuccessful, onVerify, phoneNumber]);

  const handleSendCode = (e) => {
    e.preventDefault();
    setViewError(""); 
    
    if (!phoneNumber || phoneNumber.length < 7) {
      setViewError("Please enter a valid phone number.");
      return;
    }
    
    // Reset confirmation state and trigger the request mutation
    confirm.reset(); 
    request.mutate(phoneNumber);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setViewError(""); 
    
    if (!verificationCode || verificationCode.length !== 6) {
      setViewError("Verification code must be 6 digits.");
      return;
    }

    // Trigger the confirm mutation
    confirm.mutate({ otp: verificationCode });
  };

  // The final error shown to the user (local validation or API)
  const finalError = viewError || (request.isError ? request.error.message : '') || (confirm.isError ? confirm.error.message : '');

  // Render logic follows your original structure
  return (
    <div className="max-w-[700px] w-full mx-auto p-4 sm:p-8 lg:p-10">
      
      {/* Title Section */}
      <div className="mb-4 text-left">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Verify your phone number 📱
        </h2>
        <p className="text-base text-gray-600">
          We need to verify your phone number to secure your account.
        </p>
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* Verification Success Message */}
      {isVerified && (
        <div className="flex items-center p-4 mb-4 bg-green-100 border border-green-400 text-green-800 rounded-lg shadow-md">
          <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
          <p className="font-bold">Verification Complete!</p>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && !isVerified && (
        <div className="flex items-center justify-center p-4 mb-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-md">
          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" /> 
          {isCodeSent ? "Verifying code..." : "Sending code..."}
        </div>
      )}

      {/* Error Message */}
      {finalError && !isLoading && !isVerified && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300" role="alert">
          <XCircle className="w-4 h-4 mr-2" />
          <span className="font-medium">Error:</span> {finalError}
        </div>
      )}

      {/* Form for Phone Input or Code Input */}
      {!isCodeSent && !isVerified ? (
        // --- STEP 2a: Phone Number Input ---
        <form onSubmit={handleSendCode}>
          {/* ... Phone Input Field ... */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300">
              <Phone className="w-5 h-5 text-gray-500 mx-3" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="e.g., +1 (555) 123-4567"
                className="flex-grow p-3 border-none outline-none text-gray-900 bg-transparent"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || phoneNumber.length < 7} 
            className={`w-full py-4 mt-6 text-white font-bold text-lg shadow-md transition duration-200 rounded-md ${
              (isLoading || phoneNumber.length < 7) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b5734c] hover:bg-[#c2825d]'
            }`}
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 mt-4 text-gray-600 font-semibold hover:text-gray-800 transition duration-200 rounded-md"
            disabled={isLoading}
          >
            ← Back to Business Info
          </button>
        </form>
      ) : (
        // --- STEP 2b: Verification Code Input ---
        <form onSubmit={handleVerify}>
          <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 mb-6 rounded-md" role="alert">
            <p className="font-bold">Code Sent!</p>
            <p className="text-sm">Please check your SMS for the code sent to **{phoneNumber}**.</p>
          </div>
          
          {/* ... Code Input Field ... */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Verification Code <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-300">
              <Lock className="w-5 h-5 text-gray-500 mx-3" />
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter 6-digit code (Hint: 123456)"
                className="flex-grow p-3 border-none outline-none text-gray-900 bg-transparent"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6} 
            className={`w-full py-4 mt-6 text-white font-bold text-lg shadow-md transition duration-200 rounded-md ${
              (isLoading || verificationCode.length !== 6) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b5734c] hover:bg-[#c2825d]'
            }`}
          >
            {isLoading ? "Verifying..." : "Verify and Continue"}
          </button>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-gray-800 font-semibold transition duration-200"
              disabled={isLoading}
            >
              ← Change Business Info
            </button>
            <button
              type="button"
              onClick={() => {
                request.reset();
                confirm.reset();
                setViewError("");
              }}
              className="text-sm text-orange-600 hover:text-orange-800 font-semibold transition duration-200"
              disabled={isLoading}
            >
              Resend Code
            </button>
          </div>
        </form>
      )}
    </div>
  );
}