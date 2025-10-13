'use client'; 

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqAccordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <span className="font-semibold text-gray-800">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600 text-sm animate-fade-in-down">
          {answer}
        </div>
      )}
    </div>
  );
};