'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Hero } from '@/types';
import { motion } from 'framer-motion';

interface HeroGridProps {
  heroes: Hero[];
  selectedHeroIds: number[];
  onSelectHero: (heroId: number) => void;
}

export default function HeroGrid({ heroes, selectedHeroIds, onSelectHero }: HeroGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHeroes = useMemo(() => {
    return heroes.filter(
      h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
           !selectedHeroIds.includes(h.id)
    );
  }, [heroes, selectedHeroIds, searchQuery]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search heroes..."
        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      
      <div className="grid grid-cols-5 gap-3 max-h-[600px] overflow-y-auto p-2">
        {filteredHeroes.map(hero => (
         <motion.button
         key={hero.id}
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         onClick={() => onSelectHero(hero.id)}
         className="bg-white/5 hover:bg-white/10 p-2 transition-all border border-white/10"
       >
         <div className="relative w-full aspect-square mb-2">
           <Image 
             src={hero.image} 
             alt={hero.name}
             fill
             className="object-cover"
             sizes="(max-width: 768px) 20vw, 10vw"
             onError={(e) => {
               const target = e.target as HTMLImageElement;
               target.src = `https://via.placeholder.com/100?text=${encodeURIComponent(hero.name)}`;
             }}
           />
         </div>
         <div className="text-xs font-semibold truncate text-white">{hero.name}</div>
       </motion.button>
        ))}
      </div>
      
      <div className="text-sm text-gray-400 text-center">
        Showing {filteredHeroes.length} of {heroes.length} heroes
      </div>
    </div>
  );
}