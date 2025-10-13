'use client';

import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import IdDocumentVerification from '@/components/onboarding/Identity';
import { ChevronLeft, Shield } from "lucide-react";

export default function IdDocumentVerificationPage({ onBack }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated" || session?.user.role !== "BRAIDER") {
            router.push("/login");
        }
    }, [status, session, router]);

    if (status === "loading" || !session) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    const verificationStatus = session.user.braiderProfile?.document_verification_status;

    const handleContinue = () => {
        router.push('/onboarding/services');
    };

    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative">
            <div className="max-w-2xl w-full mx-auto">
                
                {/* Back Button — now visible and separated from top elements */}
                <button 
                    onClick={onBack}
                    className="absolute top-20 left-4 sm:left-8 flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-150"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                </button>

                {/* Center Header Section */}
                <div className="text-center mt-16 sm:mt-20 mb-10">
                    <Shield className="w-14 h-14 mx-auto text-[#b5734c]" />
                    <h2 className="text-2xl font-semibold text-black mt-5">
                        Identity Verification
                    </h2>
                    <p className="text-base mt-2 text-gray-600">
                        Please verify your identity to complete your profile and start accepting bookings.
                    </p>
                </div>

                <hr className="mb-8 border-gray-200" />

                {/* Verification Component */}
                <div className="mb-6">
                    <IdDocumentVerification verificationStatus={verificationStatus} />
                </div>

                {/* Continue Button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleContinue}
                        type="button"
                        className="px-6 py-3 border-1 border-[#b5734c] text-[#b5734c] font-medium text-base rounded-lg shadow-sm hover:bg-[#b5734c] hover:text-white transition duration-200"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </main>
    );
}
