"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function LoginView({ onBack }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/onboarding/business-info" });
  };

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result.error) {
      setError("Invalid email or password. Please try again.");
    } else if (result.ok) {
      router.push("/onboarding/business-info");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Content Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16">
        {/* Back Button */}
        {/* <header className="mb-12 relative">
          <button
            onClick={onBack}
            className="absolute -top-4 -left-4 sm:top-0 sm:left-0 flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-150"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </header> */}

        {/* Main Content Form */}
        <main className="flex-grow flex flex-col justify-center max-w-md mx-auto py-10">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
            Afro Connect for Braiders
          </h1>
          <p className="text-base text-gray-600 mb-8">
            Create an account or log in to book and manage your appointments.
          </p>

          {/* Email Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-sm font-semibold text-gray-800">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email-address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="hello@teni.com"
                  className={`w-full py-3 pl-10 pr-3 border ${
                    emailError ? "border-red-500" : "border-gray-300"
                  } focus:ring-[#c2825d] focus:border-[#b5734c] outline-none text-gray-900`}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-sm font-semibold text-gray-800">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-10 pr-3 border border-gray-300 focus:ring-[#c2825d] focus:border-[#b5734c] outline-none text-gray-900"
                  placeholder="Password"
                />
              </div>

              <div className="flex justify-end mt-2 text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-[#b5734c] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white bg-[#b5734c] hover:bg-[#b47550] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b47550] disabled:bg-[#b5734c]"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* OR Separator */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 shadow-sm text-gray-700 font-semibold hover:bg-gray-50 transition duration-150 mb-6"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#b5734c] font-medium hover:underline ml-1"
            >
              Sign Up as a Professional
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600 mt-8">
            Haven&apos;t verified my account?{" "}
            <Link
              href="/resend-verification"
              className="text-[#b5734c] font-medium hover:underline ml-1"
            >
              Revalidate
            </Link>
          </p>
        </main>

        {/* Footer/Contact Section */}
        <footer className="mt-12 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0 1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>support@afrobraidconnect.com</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM2.5 9h19M2.5 15h19"></path>
            </svg>
            <span className="font-bold">ENG</span>
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </footer>
      </div>

      {/* Right Image Panel (Hidden on mobile) */}
      <div className="relative w-1/2 bg-gray-200 hidden md:block">
        <Image
          src="/images/hero.png" // Using the hero image path
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
