'use client';
import { useRouter } from 'next/navigation';
import SignUpView from '@/components/setup/SignUp';

export default function SignUpPage() {
    const router = useRouter();

    const handleBack = () => {
        // Go back to the role selection screen
        router.back();
    };

    return (
        <SignUpView 
            onBack={handleBack}
        />
    );
}