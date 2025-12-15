'use client';

import React from 'react';
import { Timer } from 'lucide-react';
import { DraftStep } from '@/types';

interface CurrentTurnCardProps {
  currentDraft: DraftStep;
  teamName: string;
  timeLeft: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
}

export default function CurrentTurnCard({
  currentDraft,
  teamName,
  timeLeft,
  isTimerRunning,
  onToggleTimer,
}: CurrentTurnCardProps) {
  return (
    <div className={`p-6 rounded-xl ${
      currentDraft.team === 'blue' 
        ? 'bg-blue-900/40 border-2 border-blue-500' 
        : 'bg-red-900/40 border-2 border-red-500'
    }`}>
      <div className="text-sm text-gray-300 mb-2">Current Turn</div>
      <div className="text-2xl font-bold mb-2">{teamName}</div>
      <div className="text-lg mb-4">
        {currentDraft.type === 'ban' ? '🚫 BAN' : '✅ PICK'} - {currentDraft.label}
      </div>
      <div className="flex items-center gap-2 text-3xl font-bold">
        <Timer className="w-8 h-8" />
        <span className={timeLeft <= 10 ? 'text-red-400' : ''}>
          {timeLeft}s
        </span>
      </div>
      <button
        onClick={onToggleTimer}
        className="mt-4 w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
      >
        {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
      </button>
    </div>
  );
}