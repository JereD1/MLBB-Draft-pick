'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { TeamData } from '@/types';

interface TeamDraftListProps {
  team: 'blue' | 'red';
  teamName: string;
  teamData: TeamData[];
}

export default function TeamDraftList({ team, teamName, teamData }: TeamDraftListProps) {
  return (
    <div className={`${
      team === 'blue' 
        ? 'bg-blue-900/20 border-2 border-blue-500' 
        : 'bg-red-900/20 border-2 border-red-500'
    } rounded-xl p-4`}>
      <h3 className={`text-xl font-bold mb-4 ${
        team === 'blue' ? 'text-blue-400' : 'text-red-400'
      }`}>
        {teamName}
      </h3>
      <div className="space-y-2">
        {teamData.map((draft) => (
          <motion.div
            key={draft.index}
            layout
            className={`flex items-center gap-3 p-2 rounded-lg ${
              draft.isActive 
                ? `${team === 'blue' ? 'bg-blue-600/30 ring-2 ring-blue-400' : 'bg-red-600/30 ring-2 ring-red-400'}`
                : 'bg-white/5'
            }`}
          >
            <div className={`w-12 h-12 rounded-md flex items-center justify-center ${
              draft.type === 'ban' ? 'bg-red-500/20' : 'bg-green-500/20'
            }`}>
              {draft.hero ? (
                <img 
                  src={draft.hero.image} 
                  alt={draft.hero.name} 
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=' + draft.hero?.name;
                  }}
                />
              ) : (
                draft.type === 'ban' 
                  ? <X className="w-6 h-6 text-red-400" />
                  : <Check className="w-6 h-6 text-green-400" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold">{draft.label}</div>
              <div className="text-xs text-gray-400">
                {draft.hero?.name || 'Not selected'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
