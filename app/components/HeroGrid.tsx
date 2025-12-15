'use client';

import React, { useState, useMemo } from 'react';
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
         <img 
           src={hero.image} 
           alt={hero.name}
           className="w-full aspect-square object-cover mb-2"
           onError={(e) => {
             (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=' + hero.name;
           }}
         />
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