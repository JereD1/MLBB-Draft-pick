'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, X } from 'lucide-react';
import { TeamData } from '@/types';
import Image from 'next/image';

interface OverlayTeamSectionProps {
  team: 'blue' | 'red';
  teamName: string;
  teamData: TeamData[];
  isCurrentTurn: boolean;
  currentDraftType: 'pick' | 'ban';
}

export default function OverlayTeamSection({
  team,
  teamName,
  teamData,
  isCurrentTurn,
  currentDraftType,
}: OverlayTeamSectionProps) {
  const bans = teamData.filter(d => d.type === 'ban');
  const picks = teamData.filter(d => d.type === 'pick');

  return (
    <div className="flex-1">
      <div className={`bg-linear-to-br ${
        team === 'blue' 
          ? 'from-blue-600 to-blue-800' 
          : 'from-red-600 to-red-800'
      } rounded-xl p-6 shadow-2xl mb-6`}>
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">{teamName}</h2>
        </div>
        {isCurrentTurn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/20 rounded-lg p-3 animate-pulse"
          >
            <div className="text-xl font-bold">
              {currentDraftType === 'ban' ? '🚫 BANNING...' : '✅ PICKING...'}
            </div>
          </motion.div>
        )}
      </div>

      <div className="mb-6">
        <div className="text-lg font-semibold text-red-400 mb-3">BANS</div>
        <div className="flex gap-3">
          {bans.map((draft) => (
            <div 
              key={draft.index}
              className="relative w-20 h-20 bg-black/40 rounded-lg border-2 border-red-500 overflow-hidden"
            >
              {draft.hero ? (
                <>
                  <Image
                  width={100}
                  height={100}
                    src={draft.hero.image} 
                    alt={draft.hero.name} 
                    className="w-full h-full object-cover opacity-50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=X';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <X className="w-10 h-10 text-red-500" strokeWidth={3} />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <X className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-lg font-semibold text-green-400 mb-3">PICKS</div>
        <div className="space-y-3">
          {picks.map((draft) => (
            <motion.div
              key={draft.index}
              layout
              className={`flex items-center gap-4 bg-black/40 rounded-lg p-3 border-2 ${
                draft.isActive 
                  ? `${team === 'blue' ? 'border-blue-400' : 'border-red-400'} animate-pulse`
                  : `${team === 'blue' ? 'border-blue-900' : 'border-red-900'}`
              }`}
            >
              <div className={`w-16 h-16 ${
                team === 'blue' ? 'bg-blue-900/50' : 'bg-red-900/50'
              } rounded-lg overflow-hidden`}>
                {draft.hero ? (
                  <Image
                  height={100}
                  width={100}
                    src={draft.hero.image} 
                    alt={draft.hero.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=' + draft.hero?.name;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">
                    ?
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-400">{draft.label}</div>
                <div className="text-lg font-bold text-white">
                  {draft.hero?.name || '---'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}