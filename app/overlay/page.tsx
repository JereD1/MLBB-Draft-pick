'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Timer } from 'lucide-react';
import { fetchHeroes } from '@/lib/api';
import { useDraft } from '@/hooks/useDraft';
import OverlayTeamSection from '@/app/components/OverlayTeamSection';
import ConnectionStatus from '../components/ConnectionStatus';
import { Hero } from '@/types';

export default function OverlayPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadHeroes = async () => {
      try {
        const data = await fetchHeroes();
        if (mounted) {
          setHeroes(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading heroes:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHeroes();

    return () => {
      mounted = false;
    };
  }, []);

  const { state, currentDraft, getTeamData } = useDraft(heroes);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-transparent flex items-center justify-center">
        <div className="text-white/60 text-xl">Loading overlay...</div>
      </div>
    );
  }

  const blueTeam = getTeamData('blue');
  const redTeam = getTeamData('red');

  return (
    <div className="w-screen h-screen bg-transparent p-8">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
        <div className="flex justify-between items-center mb-6">
  <div>
    <h1>MLBB Pick & Ban Controller</h1>
    <ConnectionStatus /> 
  </div>
  ...
</div>
          <Link
            href="/controller"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-white"
          >
            ← Controller
          </Link>
          <div className="text-center">
            <div className="text-4xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
              PICK & BAN PHASE
            </div>
            <div className="text-gray-400 mt-2">Phase {currentDraft.phase}</div>
          </div>
          <div className="text-5xl font-bold text-white flex items-center gap-3">
            <Timer className="w-10 h-10" />
            <span className={state.timeLeft <= 10 ? 'text-red-400 animate-pulse' : ''}>
              {state.timeLeft}
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-between gap-8">
          <OverlayTeamSection
            team="blue"
            teamName={state.teamNames.blue}
            teamData={blueTeam}
            isCurrentTurn={currentDraft.team === 'blue'}
            currentDraftType={currentDraft.type}
          />

          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold bg-linear-to-b from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              VS
            </div>
          </div>

          <OverlayTeamSection
            team="red"
            teamName={state.teamNames.red}
            teamData={redTeam}
            isCurrentTurn={currentDraft.team === 'red'}
            currentDraftType={currentDraft.type}
          />
        </div>
      </div>
    </div>
  );
}