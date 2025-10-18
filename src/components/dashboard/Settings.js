'use client'; // This screen uses state, so it must be a client component.

import React, { useState } from 'react';
import Image from 'next/image';
import {  Globe } from 'lucide-react';
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { SettingsNav } from '../generics/settings/Navbar';
import { SettingsSection } from '../generics/settings/Section';
import { InputRow } from '../generics/settings/InputRow';
import { ToggleRow } from '../generics/settings/ToggleRow';


const ProfileSettings = () => (
  <SettingsSection title="Profile Settings" description="Update your photo and personal details here.">
    <div className="flex items-center gap-4">
      <Image src="/images/profile.jpg" alt="Profile" width={500} height={500} className="w-20 h-20 rounded-full" />
      <div>
        <button className="px-4 py-2 bg-theme-primary text-white font-semibold rounded-lg hover:bg-opacity-90">Upload New Photo</button>
        <p className="text-xs text-gray-500 mt-2">Recommended size: 400x400px</p>
      </div>
    </div>
    <InputRow label="Full Name" id="fullName" defaultValue="Jessica Nwosu" />
    <InputRow label="Email Address" id="email" type="email" defaultValue="jessica.n@example.com" />
    <InputRow label="Phone Number" id="phone" type="tel" defaultValue="+234 801 234 5678" />
  </SettingsSection>
);

const AccountSettings = () => (
  <SettingsSection title="Account Settings" description="Manage your login and security settings.">
    <InputRow label="Current Password" id="currentPass" type="password" />
    <InputRow label="New Password" id="newPass" type="password" />
    <InputRow label="Confirm New Password" id="confirmPass" type="password" />
    <button className="px-4 py-2 bg-gray-800 text-white font-semibold hover:bg-gray-700">Change Password</button>
    <hr/>
    <ToggleRow title="Two-Factor Authentication (2FA)" description="Add an extra layer of security to your account." enabled={false} />
  </SettingsSection>
);

const BusinessPreferences = () => (
   <SettingsSection title="Business Preferences" description="Customize your business hours and notifications.">
    <ToggleRow title="Email Notifications" description="Receive updates about new bookings and messages." enabled={true} />
    <ToggleRow title="Push Notifications" description="Get instant alerts on your mobile device." enabled={true} />
    <ToggleRow title="SMS Notifications" description="Get notified via text messages." enabled={false} />
  </SettingsSection>
);

const SocialLinks = () => (
  <SettingsSection title="Social Media Links" description="Connect your social profiles to share with clients.">
    <InputRow label="Instagram" id="instagram" placeholder="https://instagram.com/yourhandle" icon={FaInstagram} />
    <InputRow label="Facebook" id="facebook" placeholder="https://facebook.com/yourpage" icon={FaFacebook} />
    <InputRow label="Personal Website" id="website" placeholder="https://yourwebsite.com" icon={Globe} />
  </SettingsSection>
);

const PrivacySecurity = () => (
  <SettingsSection title="Privacy & Security" description="Control your profile visibility and data settings.">
    <ToggleRow title="Profile Visibility" description="Allow your profile to be discovered publicly." enabled={true} />
    <ToggleRow title="Show Online Status" description="Let clients know when you're online." enabled={true} />
  </SettingsSection>
);

const DangerZone = () => (
   <SettingsSection title="Danger Zone" description="Manage high-risk actions for your account.">
     <div className="p-4 bg-red-50 border border-red-200">
        <h4 className="font-bold text-red-800">Deactivate Account</h4>
        <p className="text-sm text-red-700 mt-1">Your profile and portfolio will be temporarily hidden until you log back in.</p>
        <button className="mt-2 text-sm font-semibold text-red-600 hover:underline">Deactivate</button>
     </div>
     <div className="p-4 bg-red-50 border border-red-200">
        <h4 className="font-bold text-red-800">Delete Account Permanently</h4>
        <p className="text-sm text-red-700 mt-1">This action is irreversible. All your data, including bookings and earnings, will be permanently deleted.</p>
        <button className="mt-2 text-sm font-semibold text-red-600 hover:underline">Request Deletion</button>
     </div>
   </SettingsSection>
);

// Main Screen Component
export const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'account': return <AccountSettings />;
      case 'business': return <BusinessPreferences />;
      case 'social': return <SocialLinks />;
      case 'privacy': return <PrivacySecurity />;
      case 'danger': return <DangerZone />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <main className="p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and business preferences.</p>
      </div>
      
      {/* New Horizontal Tab Navigation */}
      <div className="mb-8">
        <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Content Area */}
      <div>
        {renderContent()}
      </div>
    </main>
  );
};