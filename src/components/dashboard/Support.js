import React from 'react';
import { CreditCard, CalendarCheck, Lock, Phone } from 'lucide-react';
import { HelpCard } from '../generics/support/HelpCard';
import { FaqAccordion } from '../generics/support/Faq';
import { LiveChatButton } from '../generics/support/LiveChat';

export const SupportScreen = () => {
  return (
    <>
      <main className="p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Support Center</h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Need help? We’re here to assist you. Find answers to common questions or get in touch with our team.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <HelpCard icon={CreditCard} title="Payment Issues" description="Learn how payouts, deposits, and refunds work." />
          <HelpCard icon={CalendarCheck} title="Booking Problems" description="Help with managing or editing appointments." />
          <HelpCard icon={Lock} title="Account & Verification" description="Resolve login, password, or ID verification issues." />
          <HelpCard icon={Phone} title="Contact Support" description="Talk to our dedicated team directly for any issue." />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-2 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <select id="subject" className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-theme-primary/50 focus:border-theme-primary">
                  <option>Payment Issue</option>
                  <option>Booking Problem</option>
                  <option>Account Help</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" rows="5" placeholder="Please describe your issue in detail..." className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-theme-primary/50 focus:border-theme-primary"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Attach File (Optional)</label>
                <input type="file" className="mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-theme-primary/10 file:text-theme-primary hover:file:bg-theme-primary/20"/>
              </div>
              <button type="submit" className="w-full bg-theme-primary text-white font-bold py-3 hover:bg-opacity-90 transition-all">
                Submit Ticket
              </button>
            </form>
          </div>

          {/* Right Column: FAQ and Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Frequently Asked Questions</h3>
              <FaqAccordion question="How do I change my password?" answer="You can change your password by going to the 'Settings' page and clicking on 'Security'. From there, you'll see an option to update your password." />
              <FaqAccordion question="When do I receive my payouts?" answer="Payouts are processed automatically every Friday for the previous week's completed bookings. It may take 1-2 business days for the funds to appear in your bank account." />
              <FaqAccordion question="Can I cancel a booking?" answer="Yes, you can cancel a booking from the 'Bookings' page. Please be aware of our cancellation policy, as last-minute cancellations may affect your rating." />
            </div>
            <div className="bg-white p-6 shadow-sm text-center">
               <h3 className="text-lg font-bold text-gray-800 mb-2">Direct Contact</h3>
               <p className="text-gray-600">For urgent issues, you can reach us at:</p>
               <a href="mailto:support@afrobraidconnect.com" className="font-semibold text-theme-primary hover:underline">support@afrobraidconnect.com</a>
            </div>
          </div>
        </div>
      </main>

      <LiveChatButton />
    </>
  );
};