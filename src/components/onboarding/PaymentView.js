'use client';
import React, { useState } from 'react';
import { ChevronLeft, Zap, ExternalLink, Loader2 } from "lucide-react";

// The original import for ProgressBar is retained
import ProgressBar from '../generics/ProgressBar'; 

const CURRENT_STEP = 5;

/**
 * Renders a view to prompt the user to connect their account to Stripe 
 * for payment processing, replacing the manual card input form.
 */
export default function PaymentView({ onPaymentComplete, onSkip, onBack }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Mock API Call to Get Stripe Connect URL ---
    const getStripeConnectUrl = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // NOTE: In a real app, this should be done using a Tanstack Mutation
            // to call your backend, which then generates the secure Stripe Connect URL.
            
            // Simulating API latency
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            // Mock successful response with a generated URL (Replace with your actual API call result)
            const mockUrl = 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_MOCK_CLIENT_ID&scope=read_write';
            
            // Redirect the user to Stripe's onboarding flow
            window.location.href = mockUrl;
            
            // Since the user is redirected, the code below this won't run immediately.
            // However, we clear loading state just in case, but the redirect is the primary action.
            setIsLoading(false);
            
        } catch (err) {
            console.error("Stripe URL generation failed:", err);
            setError("Failed to generate Stripe link. Please try again. Check your connection.");
            setIsLoading(false);
        }
    };

    const handleConnectClick = (e) => {
        e.preventDefault();
        getStripeConnectUrl();
    };

    return (
        <div className="min-h-screen bg-white pt-[80px] font-sans">
            <ProgressBar currentStep={CURRENT_STEP} />
            
            <div className="max-w-[700px] w-full mx-auto p-4 sm:p-8 lg:p-10">
                
                <button 
                    onClick={onBack} 
                    className="absolute top-24 left-4 sm:left-8 flex items-center text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
                
                <div className="mb-4 mt-12 sm:mt-0 text-left">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Set Up Payments 
                    </h2>
                    <p className="text-base text-gray-600">
                        Securely connect with Stripe. This is mandatory to fully activate your services.
                    </p>
                </div>

                <hr className="my-8 border-gray-200" />
                
                {/* Mock Plan Selection (Retained structure but simplified content) */}
                <div className="p-6 border-1 border-[#b5734c] bg-orange-50/50 mb-8 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center mb-2">
                        <Zap className="w-6 h-6 mr-2 text-[#b5734c]" /> Subscribe
                    </h3>
                    <p className="text-gray-700 mb-4">
                        Click the button below to unlock the platform, manage your bookings, and accept client payments securely.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                        <ExternalLink size={14} className="mr-2 flex-shrink-0" />
                        We do not store your payment information.
                    </div>
                </div>
                
                {/* Error Display */}
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300" role="alert">
                        {error}
                    </div>
                )}
                
                {/* Action Buttons */}
                <form onSubmit={handleConnectClick} className="space-y-4">
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 font-bold text-lg shadow-md transition flex items-center justify-center ${
                            isLoading 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-[#b5734c] text-white hover:bg-[#c2825d]'
                        }`}
                    >
                        {isLoading ? (
                            <><Loader2 className="animate-spin mr-3 h-5 w-5" /> Redirecting to Stripe...</>
                        ) : (
                            <>Connect Stripe Account</>
                        )}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={onSkip} 
                        disabled={isLoading}
                        className="w-full py-3 font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        Skip for now
                    </button>
                    
                </form>

            </div>
        </div>
    );
}