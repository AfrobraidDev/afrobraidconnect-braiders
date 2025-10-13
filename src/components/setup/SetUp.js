'use client';
import React from 'react';
import Image from 'next/image'; 
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';



const HeroImage = ({ src, alt, ...props }) => (
  <div className="absolute inset-0">
    <Image
      src={src}
      alt={alt}
      fill
      priority
      className="object-cover object-center"
      sizes="(max-width: 768px) 0vw, 50vw"
      {...props}  // ✅ forward any extra props (important)
    />
    <div className="absolute inset-0 bg-black/10" />
  </div>
);



// Mock Component for Logo/Branding
const AfroBraidLogo = () => (
    <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-[#E5B89B] flex items-center justify-center text-sm font-bold text-white">aBc</div>
        <span className="text-sm font-semibold text-gray-800">afrobraids connect</span>
    </div>
);

// Mock Component for Profile Pictures
const ProfileIcon = ({ src, alt }) => (
    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <div className="w-full h-full bg-gray-300 border border-gray-100 shadow-sm" style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} role="img" aria-label={alt} />
    </div>
);

// Role Selection Card Component
const RoleCard = ({ title, description, role, iconSrc, onSelect }) => (
    <button
        onClick={() => onSelect(role)}
        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#b5734c] hover:shadow-md transition duration-200 w-full text-left bg-white"
    >
        <div className="flex items-center space-x-4">
            <ProfileIcon src={iconSrc} alt={title} />
            <div>
                <h3 className="text-base font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
    </button>
);


export default function SetUpView({ onSelectRole }) {
    return (
        <div className="min-h-screen flex font-sans bg-white">
            
            {/* Left Content Panel (Visible on all screen sizes) */}
            <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16">
                
                {/* Header/Logo Section */}
                <header className="mb-12">
                    <AfroBraidLogo />
                </header>

                {/* Main Content (Centered vertically within the section) */}
                <main className="flex-grow flex flex-col justify-center max-w-md mx-auto md:mx-0 py-10">
                    <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
                        Get Connected. Get Braided.
                    </h1>
                    <p className="text-normal text-gray-600 mb-10">
                        Select your role to personalize your experience.
                    </p>

                    <h2 className="text-base font-medium text-gray-900 mb-4">Choose your role</h2>

                    <div className="space-y-4">
                        <RoleCard
                            title="Afro Connect for Customers"
                            description="I am looking to book a braider."
                            role="customer"
                            iconSrc="/images/Customer.png"
                            onSelect={onSelectRole}
                        />
                        <RoleCard
                            title="Afro Connect for Braiders"
                            description="I am a braider looking for new clients."
                            role="braider"
                            iconSrc="/images/stylist.png"
                            onSelect={onSelectRole}
                        />
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        Already have an account? 
                        <Link href="/login" className="text-[#b5734c] font-semibold hover:underline ml-1">
                            Log In
                        </Link>
                    </p>
                </main>
                
                {/* Footer/Contact Section */}
                <footer className="mt-12 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <span>support@afrobraidconnect.com</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM2.5 9h19M2.5 15h19"></path></svg>
                        <span className="font-bold">ENG</span>
                        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </footer>
            </div>

            {/* Right Image Panel (Hidden on mobile) */}
            <div className="relative w-1/2 bg-gray-200 hidden md:block">
                <HeroImage
                    src="/images/hero.png" 
                    alt="Happy woman with stylish braided hair"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 0vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>
        </div>
    );
}
