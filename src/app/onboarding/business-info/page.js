'use client';

import { useRouter } from 'next/navigation';
import BusinessInfoView from '@/components/onboarding/BusinessInfoView'; 


export default function BusinessInfoPage() { 
    const router = useRouter();

    const handleContinue = (formData) => {
        console.log("Saving step 1 data:", formData);
        
        router.push('/onboarding/services'); 
    };

    
    return (
        <BusinessInfoView onContinue={handleContinue} />
    );
}

