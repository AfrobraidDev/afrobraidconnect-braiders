'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import PaymentView from '@/components/onboarding/PaymentView';

export default function PaymentPage() {
    const router = useRouter();

    // This function is called when the user successfully 'pays'.
    const handlePaymentComplete = (paymentData) => {
        // In a real application, you would send this data to your server
        // to be processed by Stripe.
        console.log("--- PAYMENT DETAILS SUBMITTED ---");
        console.log("Mock Payment Data:", paymentData);
        alert("Payment successful! Redirecting to your dashboard.");
        
        // Redirect to the dashboard after successful payment
        router.push('/dashboard');
    };

    // This function is called when the user decides to skip payment.
    const handleSkip = () => {
        console.log("--- PAYMENT SKIPPED ---");
        alert("You can set up payments later from your settings. Redirecting to your dashboard.");
        
        // Redirect to the dashboard after skipping
        router.push('/dashboard');
    };
    
    // This function handles the back navigation
    const handleBack = () => {
        router.back(); // Or router.push('/portfolio');
    };

    return (
        <div>
            <PaymentView 
                onPaymentComplete={handlePaymentComplete}
                onSkip={handleSkip}
                onBack={handleBack}
            />
        </div>
    );
}
