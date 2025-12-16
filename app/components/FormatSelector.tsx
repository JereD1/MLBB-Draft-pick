// ============================================================================
// Draft Format Selector Component
// FILE: app/components/FormatSelector.tsx
// ============================================================================
'use client';

import React from 'react';
import { DraftFormat } from '@/types';
import { Trophy, Users } from 'lucide-react';

interface FormatSelectorProps {
  currentFormat: DraftFormat;
  onFormatChange: (format: DraftFormat) => void;
  disabled?: boolean;
}

export default function FormatSelector({ 
  currentFormat, 
  onFormatChange,
  disabled = false 
}: FormatSelectorProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
        Draft Format
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Normal Lobby Button */}
        <button
          onClick={() => onFormatChange('normal')}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-3 rounded-lg transition-all
            ${currentFormat === 'normal'
              ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/30'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600 border-2 border-transparent hover:border-slate-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Users className="w-5 h-5 shrink-0" />
          <div className="text-left flex-1">
            <div className="font-bold text-sm">Normal Lobby</div>
            <div className="text-xs opacity-80">6 Bans · 10 Picks</div>
          </div>
          {currentFormat === 'normal' && !disabled && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </button>

        {/* Tournament Button */}
        <button
          onClick={() => onFormatChange('tournament')}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-3 rounded-lg transition-all
            ${currentFormat === 'tournament'
              ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/30'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600 border-2 border-transparent hover:border-slate-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Trophy className="w-5 h-5 shrink-0" />
          <div className="text-left flex-1">
            <div className="font-bold text-sm">Tournament</div>
            <div className="text-xs opacity-80">10 Bans · 10 Picks</div>
          </div>
          {currentFormat === 'tournament' && !disabled && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </button>
      </div>
      
      {/* Warning Message */}
      {disabled && (
        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
          <span className="text-yellow-400 text-lg">⚠️</span>
          <p className="text-yellow-400 text-xs">
            Format locked - Draft has already started
          </p>
        </div>
      )}
      
      {/* Info Message */}
      {!disabled && (
        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded">
          <span className="text-blue-400 text-lg">💡</span>
          <p className="text-blue-400 text-xs">
            Select format before starting the draft
          </p>
        </div>
      )}
    </div>
  );
}