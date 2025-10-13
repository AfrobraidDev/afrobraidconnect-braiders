'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PortfolioView from '@/components/onboarding/PortfolioView';

// This is the parent component for the Portfolio section of the onboarding
export default function PortfolioPage() {
    const router = useRouter();

    // State to hold the final portfolio data
    const [portfolioData, setPortfolioData] = useState(null);

    // This is the final step of the entire onboarding flow
    const handlePortfolioComplete = (data) => {
        setPortfolioData(data);
        
        // In a real application, you would submit this final data along with
        // any previously collected data to your server/database.
        console.log("--- ONBOARDING COMPLETE ---");
        console.log("Final Portfolio Data:", data);
        router.push('/onboarding/payment');
    };

    // Handles navigating back to the previous part of the flow (services/address)
    const handleBack = () => {
        router.back();
    };

    return (
        <div>
            <PortfolioView 
                onStepComplete={handlePortfolioComplete} 
                onBack={handleBack} 
            />
        </div>
    );
}

