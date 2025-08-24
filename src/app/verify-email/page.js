"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { apiController } from "@/utils/apiController";

function VerificationComponent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your email, please wait..."
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing. Please check the link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await apiController({
          method: "GET",
          url: `/auth/verify-email/`,
          params: { token },
        });

        if (response.email === "Successfully activated") {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
        } else {
          throw new Error("Unexpected response from server.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.detail ||
            "Verification failed. The link may be expired or invalid."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-xl shadow-lg">
      {status === "verifying" && (
        <>
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-800">Verifying...</h1>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          <h1 className="text-2xl font-bold text-green-700">
            Verification Successful!
          </h1>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="w-16 h-16 mx-auto text-red-500" />
          <h1 className="text-2xl font-bold text-red-700">
            Verification Failed
          </h1>
        </>
      )}
      <p className="text-gray-600">
        {message}
        <br />
        <Link
          href="/resend-verification"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Request a new one.
        </Link>
      </p>
      {status !== "verifying" && (
        <Link
          href="/login"
          className="inline-block w-full px-4 py-3 mt-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Proceed to Login
        </Link>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <Suspense fallback={<p>Loading...</p>}>
        <VerificationComponent />
      </Suspense>
    </main>
  );
}
