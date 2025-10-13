'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

// Import the screen components. Assumes they are in the same directory.
import ServiceTypeView from '@/components/onboarding/ServiceTypeView';
import AddressView from '@/components/onboarding/ServiceArea';

// This is the parent component that controls the first part of the flow
export default function ServicesPage() {
    const router = useRouter(); // Initialize router

    // State to manage which step/screen is currently active
    const [currentStep, setCurrentStep] = useState('serviceType'); // 'serviceType', 'address'
    
    // State to hold form data from the service and address steps
    const [formData, setFormData] = useState({
        serviceTypes: [],
        address: null,
    });

    // --- Step Completion Handlers ---

    // Called from ServiceTypeView. Moves to the address screen.
    const handleServiceTypeComplete = (data) => {
        setFormData(prev => ({ ...prev, serviceTypes: data }));
        setCurrentStep('address');
    };

    // Called from AddressView. This is the final step for this page.
    const handleAddressComplete = (data) => {
        // Combine the latest data with the existing formData
        const finalServiceData = { ...formData, address: data };
        setFormData(finalServiceData);
        
        // In a real application, you would save this data before moving on
        console.log("--- SERVICES & ADDRESS DATA SAVED ---");
        console.log("Data:", finalServiceData);
        
        // Navigate to the portfolio page to continue the onboarding process
        router.push('/onboarding/portfolio');
    };

    // --- Back Navigation Handler ---

    // A single function to handle moving to the previous step
    const goToPreviousStep = () => {
        if (currentStep === 'address') {
            setCurrentStep('serviceType');
        }
    };

    // --- Render Logic ---

    // Use a switch statement to conditionally render the correct component
    switch (currentStep) {
        case 'serviceType':
            // The first step doesn't have a 'onBack' prop
            return <ServiceTypeView onStepComplete={handleServiceTypeComplete} />;
        
        case 'address':
            return <AddressView onStepComplete={handleAddressComplete} onBack={goToPreviousStep} />;
        
        default:
            // Default to the first step if the state is ever invalid
            return <ServiceTypeView onStepComplete={handleServiceTypeComplete} />;
    }
}

