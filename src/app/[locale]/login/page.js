'use client';
import { useRouter } from 'next/navigation';
import LoginView from '@/components/setup/Login';

export default function LoginPage() {
    const router = useRouter();

    const handleBack = () => {
        // Go back to the role selection screen
        router.back();
    };

    return (
        <LoginView 
            onBack={handleBack}
        />
    );
}