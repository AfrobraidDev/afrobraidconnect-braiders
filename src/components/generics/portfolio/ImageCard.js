import React from 'react';
import Image from 'next/image';
import { Heart, MoreVertical } from 'lucide-react';

export const PortfolioImageCard = ({ style }) => (
  <div className="group relative rounded-xl overflow-hidden shadow-md cursor-pointer">
    <Image src={style.imageUrl} alt={style.title} width={500} height={500} className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 p-4 text-white w-full">
      <h4 className="font-bold text-lg">{style.title}</h4>
      <div className="flex justify-between items-center text-sm opacity-80">
        <p>{style.description}</p>
        <div className="flex items-center gap-1">
          <Heart size={14} />
          <span>{style.likes}</span>
        </div>
      </div>
    </div>
    <button className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
      <MoreVertical size={18} />
    </button>
  </div>
);