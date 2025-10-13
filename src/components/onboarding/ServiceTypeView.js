'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Added for navigation
import { User, Building, Home, ChevronLeft, Truck } from "lucide-react";
import ProgressBar from '../generics/ProgressBar';


const CURRENT_STEP = 3;

// Data for the service cards
const serviceOptions = [
    {
        id: 'salon',
        title: 'Salon/Shop Owner',
        description: 'I operate a braiding salon with multiple stylists',
        icon: Building,
    },
    {
        id: 'mobile',
        title: 'Mobile Braiding Service',
        description: "I travel to clients' locations to provide services",
        icon: Truck,
    },
    {
        id: 'home',
        title: 'Home-Based Salon',
        description: 'I operate from a professional home studio',
        icon: Home,
    },
];

// Helper component for the clickable cards
const ServiceCard = ({ option, isSelected, onSelect }) => {
    const Icon = option.icon;

    return (
        <button
            type="button"
            onClick={() => onSelect(option.id)}
            className={`
                flex flex-col items-start p-4 border rounded-lg h-full text-left transition-all duration-200
                ${isSelected 
                    ? 'border-[#b5734c] ring-1 ring-[#b5734c] bg-orange-50/50 shadow-md' 
                    : 'border-gray-300 hover:border-[#b5734c] hover:shadow-sm bg-white'
                }
            `}
        >
            <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-[var(--color-continue)]' : 'text-gray-500'}`} />
            <h3 className="text-base font-bold text-gray-900 mb-1">
                {option.title}
            </h3>
            <p className="text-sm text-gray-600">
                {option.description}
            </p>
        </button>
    );
};


export default function ServiceTypeView({ onStepComplete, onBack }) {
    const router = useRouter(); // Initialize router
    const [selectedServices, setSelectedServices] = useState([]);

    const handleSelectService = (serviceId) => {
        setSelectedServices(prevSelected => {
            if (prevSelected.includes(serviceId)) {
                return prevSelected.filter(id => id !== serviceId);
            } else {
                return [...prevSelected, serviceId];
            }
        });
    };

    const handleContinue = () => {
        if (selectedServices.length === 0) {
            alert("Please select at least one service type to continue.");
            return;
        }
        
        console.log("Selected services:", selectedServices);
        
        // **CRITICAL FIX**: Call the onStepComplete prop instead of using the router
        if (onStepComplete) {
            onStepComplete(selectedServices);
        }
    };

    return (
        // Full height, white background, and padding for the fixed header
        <div className="min-h-screen bg-white pt-[80px] font-sans">
            
            <ProgressBar currentStep={CURRENT_STEP} />

            {/* Content Container: Centered, max-width, responsive padding */}
            <div className="max-w-[700px] w-full mx-auto p-4 sm:p-8 lg:p-10">

                <button 
                    onClick={onBack}
                    className="absolute top-24 left-4 sm:left-8 flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-150"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                </button>
                
                {/* Title Section (Starts below back button height) */}
                <div className="mb-8 mt-12 sm:mt-0 text-left">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">What type of service do you provide?</h2>
                    <p className="text-base text-gray-600">Choose all that applies to you</p>
                </div>

                {/* Service Cards Grid - Responsive layout (2 columns on medium/large screens) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {serviceOptions.map((option) => (
                        <ServiceCard
                            key={option.id}
                            option={option}
                            // Check if the option's id is in the selectedServices array
                            isSelected={selectedServices.includes(option.id)}
                            onSelect={handleSelectService}
                        />
                    ))}
                </div>

                {/* Continue Button */}
                <button 
                    onClick={handleContinue} // Attached the handler here
                    type="button" // Changed from submit to button as it's not in a form
                    // Using CSS variable defined in global.css
                    className="w-full py-4 mt-6 bg-[#b5734c] text-white font-bold text-lg rounded-lg shadow-md hover:bg-[#c2825d] transition duration-200"
                >
                    Continue
                </button>

            </div>
        </div>
    );
}