"use client";

import React, { useState } from "react";
import { Mail, Copy, Check, HelpCircle, HeartHandshake } from "lucide-react";

export default function SupportScreen() {
  const [copied, setCopied] = useState(false);
  const supportEmail = "nyquist@afrobraidconnect.de";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="p-4 md:p-8 max-w-8xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Support & Help Center
        </h1>
        <p className="text-gray-500 text-lg">
          We are here to help you manage and grow your business seamlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-[#b5734c] text-white rounded-2xl p-8 shadow-lg relative overflow-hidden group">
            <Mail className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />

            <h2 className="text-2xl font-bold mb-4 relative z-10">
              Get in touch
            </h2>
            <p className="text-white/90 mb-8 relative z-10 leading-relaxed text-sm">
              Have a question about your account, found a bug, or have an idea
              for a new feature? Our team is ready to listen. Your success is
              our priority.
            </p>

            <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-1">
                  Support Email
                </p>
                <p className="font-mono text-sm truncate select-all">
                  {supportEmail}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                  title="Copy Email"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
                <a
                  href={`mailto:${supportEmail}`}
                  className="p-2.5 rounded-lg bg-white text-[#b5734c] hover:bg-gray-100 transition-colors font-bold flex items-center gap-2"
                >
                  <SendIcon size={20} />
                  <span className="hidden sm:inline">Send Mail</span>
                </a>
              </div>
            </div>
          </div>

          {/* Promise Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full shrink-0">
              <HeartHandshake size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Our Commitment to You
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                At AfroBraidConnect, we value your partnership. We strive to
                respond to all inquiries within 24 hours. Your feedback helps us
                build the best platform for braiders worldwide.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle size={20} className="text-gray-400" />
                Frequently Asked Questions
              </h3>
            </div>

            <div className="divide-y divide-gray-100">
              <FaqItem
                question="How do I update my availability?"
                answer="Go to your Dashboard and click on 'Settings' then 'Availability'. You can set your weekly hours and block out specific dates there."
              />
              <FaqItem
                question="When do I get paid?"
                answer="Payouts are processed automatically every week for all completed bookings. Check the 'Earnings' tab for your payout schedule."
              />
              <FaqItem
                question="Can I decline a booking?"
                answer="Yes. When a new request comes in, you have the option to Accept or Decline it from the 'Bookings' page."
              />
              <FaqItem
                question="How do I contact a client?"
                answer="Once a booking is confirmed, you can use the Chat feature in your Dashboard to message the client directly."
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const FaqItem = ({ question, answer }) => (
  <div className="p-5 hover:bg-gray-50 transition-colors group">
    <h4 className="font-semibold text-sm text-gray-800 mb-2 group-hover:text-[#b5734c] transition-colors">
      {question}
    </h4>
    <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
  </div>
);

const SendIcon = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
