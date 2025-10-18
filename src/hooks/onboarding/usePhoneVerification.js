// src/hooks/usePhoneVerification.js
import { useMutation } from "@tanstack/react-query";
import { useSession } from 'next-auth/react'; // Assuming next-auth
import { apiController } from '@/utils/apiController'; // Adjust path as needed

/**
 * Hook to manage the phone number verification process using Tanstack Query.
 */
export const usePhoneVerification = () => {
  // 1. Get the Bearer Token from the session
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const isTokenReady = status === 'authenticated' && !!token;

  // 2. Mutation for Requesting the Verification Code
  const requestMutation = useMutation({
    mutationFn: async (phoneNumber) => {
      if (!isTokenReady) {
        throw new Error("Authentication not ready. Please try again.");
      }
      return apiController({
        method: "POST",
        url: "/braiders/verify-phone/request/",
        data: { phone_number: phoneNumber },
        requiresAuth: true,
        token: token,
      });
    },
  });

  // 3. Mutation for Confirming the Verification Code
  const confirmMutation = useMutation({
    mutationFn: async ({ otp }) => {
      if (!isTokenReady) {
        throw new Error("Authentication not ready. Please try again.");
      }
      return apiController({
        method: "POST",
        url: "/braiders/verify-phone/confirm/",
        data: { otp },
        requiresAuth: true,
        token: token,
      });
    },
  });

  return {
    request: requestMutation,
    confirm: confirmMutation,
    isLoading: requestMutation.isLoading || confirmMutation.isLoading,
    isRequestSuccessful: requestMutation.isSuccess,
    isVerificationSuccessful: confirmMutation.isSuccess,
  };
};

