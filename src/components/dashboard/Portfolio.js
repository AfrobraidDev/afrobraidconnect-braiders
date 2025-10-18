'use client';
import React, { useState } from 'react';
import { PlusCircle, Image, Heart, Eye } from 'lucide-react';
import { PortfolioStatCard } from '../generics/portfolio/StatCard';
import { PortfolioImageCard } from '../generics/portfolio/ImageCard';
import { AddWorkModal } from '../generics/portfolio/AddWorkModal';


const mockPortfolio = [
  { id: 1, title: 'Knotless Braids', description: '#protectivestyles', imageUrl: '/images/styles/hairstyle1.png', likes: 125 },
  { id: 2, title: 'Lemonade Braids', description: '#sidebraids', imageUrl: '/images/styles/hairstyle2.png', likes: 230 },
  { id: 3, title: 'Fulani Braids', description: '#tribalbraids', imageUrl: '/images/styles/hairstyle3.png', likes: 98 },
  { id: 4, title: 'Box Braids', description: '#classic', imageUrl: '/images/styles/hairstyle4.png', likes: 152 },
  { id: 5, title: 'Dreads', description: '#classic', imageUrl: '/images/styles/hairstyle5.png', likes: 152 },
  { id: 6, title: 'Styled Cornrows', description: '#sidebraids', imageUrl: '/images/styles/hairstyle6.png', likes: 230 },
  { id: 7, title: 'Fulani Braids', description: '#tribalbraids', imageUrl: '/images/styles/hairstyle7.png', likes: 98 },
];

export const PortfolioScreen = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <main className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Portfolio</h1>
            <p className="text-gray-500 mt-1">Showcase your best work to attract new clients.</p>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-theme-primary text-white font-bold py-2.5 px-4 hover:bg-opacity-90 transition-all shadow-sm"
          >
            <PlusCircle size={20} />
            Add New Work
          </button>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <PortfolioStatCard icon={Image} title="Total Styles Uploaded" value="24" />
          <PortfolioStatCard icon={Heart} title="Most Liked Style" value="Lemonade Braids" />
          <PortfolioStatCard icon={Eye} title="Total Views" value="1.2k" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockPortfolio.map(style => (
            <PortfolioImageCard key={style.id} style={style} />
          ))}
        </div>
      </main>

      <AddWorkModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};