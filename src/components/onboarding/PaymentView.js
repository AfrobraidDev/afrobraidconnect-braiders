'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, CreditCard, Lock, User, Calendar } from "lucide-react";
import ProgressBar from '../generics/ProgressBar';


const CURRENT_STEP = 5;

export default function PaymentView({ onPaymentComplete, onSkip, onBack }) {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    // Basic form validation
    useEffect(() => {
        const isValid = cardName.trim() !== '' && cardNumber.length === 19 && expiry.length === 5 && cvc.length === 3;
        setIsFormValid(isValid);
    }, [cardName, cardNumber, expiry, cvc]);
    
    // Format card number with spaces (e.g., XXXX XXXX XXXX XXXX)
    const handleCardNumberChange = (e) => {
        const input = e.target.value.replace(/\s/g, ''); // Remove existing spaces
        if (/^\d*$/.test(input) && input.length <= 16) {
            const formatted = (input.match(/.{1,4}/g) || []).join(' ');
            setCardNumber(formatted);
        }
    };
    
    // Format expiry date with a slash (e.g., MM/YY)
    const handleExpiryChange = (e) => {
        let input = e.target.value.replace(/\//g, ''); // Remove existing slash
        if (/^\d*$/.test(input) && input.length <= 4) {
             if (input.length > 2) {
                input = input.slice(0, 2) + '/' + input.slice(2);
            }
            setExpiry(input);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            onPaymentComplete({ cardName, cardNumber, expiry, cvc });
        }
    };

    return (
        <div className="min-h-screen bg-white pt-[80px] font-sans">
            <ProgressBar currentStep={CURRENT_STEP} />
            <div className="max-w-[700px] w-full mx-auto p-4 sm:p-8 lg:p-10">

                <button onClick={onBack} className="absolute top-24 left-4 sm:left-8 flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
                
                <div className="mb-4 mt-12 sm:mt-0 text-left">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Set Up Payments</h2>
                    <p className="text-base text-gray-600">Securely connect with Stripe to accept payments from clients. You can also skip this for now.</p>
                </div>

                <hr className="my-8 border-gray-200" />
                
                 {/* Mock Plan Selection */}
                <div className="p-6 border-2 border-[#b5734c] bg-orange-50/50 rounded-lg mb-8">
                    <h3 className="text-lg font-bold text-gray-900">Pro Plan</h3>
                    <p className="text-gray-600">Unlock all features to grow your business.</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-2">$29.99 <span className="text-base font-medium text-gray-500">/ month</span></p>
                </div>
                
                {/* Mock Stripe Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Name on card</label>
                        <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                           <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="e.g. Jane Doe" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b5734c]"/>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Card details</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" className="w-full p-3 pl-10 border-t border-l border-r border-gray-300 rounded-t-lg focus:ring-1 focus:ring-[#b5734c]"/>
                        </div>
                        <div className="flex">
                            <div className="relative w-1/2">
                                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input type="text" value={expiry} onChange={handleExpiryChange} placeholder="MM/YY" className="w-full p-3 pl-10 border-l border-b border-gray-300 rounded-bl-lg focus:ring-1 focus:ring-[#b5734c]"/>
                            </div>
                            <div className="relative w-1/2">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input type="password" value={cvc} onChange={(e) => /^\d*$/.test(e.target.value) && e.target.value.length <= 3 && setCvc(e.target.value)} placeholder="CVC" className="w-full p-3 pl-10 border-l border-r border-b border-gray-300 rounded-br-lg focus:ring-1 focus:ring-[#b5734c]"/>
                            </div>
                        </div>
                    </div>
                    
                    {/* Security Message */}
                     <div className="flex items-center text-sm text-gray-500 pt-2">
                        <Lock size={14} className="mr-2 flex-shrink-0" />
                        Payments are processed securely by Stripe.
                    </div>

                    <button type="submit" disabled={!isFormValid} className={`w-full py-4 mt-6 font-bold text-lg rounded-lg shadow-md transition ${isFormValid ? 'bg-[#b5734c] text-white hover:bg-[#c2825d]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                        Subscribe & Finish
                    </button>
                    <button type="button" onClick={onSkip} className="w-full py-3 mt-2 font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition">
                        Skip for now
                    </button>
                </form>

            </div>
        </div>
    );
}

