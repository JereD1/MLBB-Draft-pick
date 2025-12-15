"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchHeroes } from "@/lib/api";
import { useDraft } from "@/hooks/useDraft";
import { DRAFT_PHASES } from "@/lib/DraftPhases";
import HeroGrid from "@/app/components/HeroGrid";
import CurrentTurnCard from "@/app/components/CurrentTurnCard";
import ControlPanel from "@/app/components/ControlPanel";
import ProgressBar from "@/app/components/ProgressBar";
import TeamDraftList from "@/app/components/TeamDraftList";
import ConnectionStatus from "@/app/components/ConnectionStatus";
import { Hero } from "@/types";

export default function ControllerPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadHeroes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchHeroes();

        if (mounted) {
          setHeroes(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load heroes. Please check your connection.");
          setLoading(false);
          console.error("Error loading heroes:", err);
        }
      }
    };

    loadHeroes();

    return () => {
      mounted = false;
    };
  }, []);

  const {
    state,
    currentDraft,
    selectHero,
    nextStep,
    previousStep,
    resetDraft,
    toggleTimer,
    setTeamName,
    getTeamData,
  } = useDraft(heroes);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4" />
          <div className="text-white text-xl">Loading heroes...</div>
          <div className="text-gray-400 text-sm mt-2">
            This may take a few seconds
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const selectedIds = Object.values(state.selections);
  const blueTeam = getTeamData("blue");
  const redTeam = getTeamData("red");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              MLBB Pick & Ban Controller
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-400 text-sm">
                MPL Format - Phase {currentDraft.phase} - {heroes.length} Heroes Loaded
              </p>
              <ConnectionStatus />
            </div>
          </div>
          <Link
            href="/overlay"
            target="_blank"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition"
          >
            Open Overlay →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            value={state.teamNames.blue}
            onChange={(e) => setTeamName("blue", e.target.value)}
            className="px-4 py-2 bg-blue-900/30 border-2 border-blue-500 text-white placeholder-gray-400"
            placeholder="Blue Team Name"
          />
          <input
            type="text"
            value={state.teamNames.red}
            onChange={(e) => setTeamName("red", e.target.value)}
            className="px-4 py-2 bg-red-900/30 border-2 border-red-500 text-white placeholder-gray-400"
            placeholder="Red Team Name"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-4">
            <CurrentTurnCard
              currentDraft={currentDraft}
              teamName={
                currentDraft.team === "blue"
                  ? state.teamNames.blue
                  : state.teamNames.red
              }
              timeLeft={state.timeLeft}
              isTimerRunning={state.isTimerRunning}
              onToggleTimer={toggleTimer}
            />

            <ControlPanel
              currentStep={state.currentStep}
              totalSteps={DRAFT_PHASES.length}
              onPrevious={previousStep}
              onNext={nextStep}
              onReset={resetDraft}
            />

            <ProgressBar
              currentStep={state.currentStep}
              totalSteps={DRAFT_PHASES.length}
            />
          </div>

          <div className="col-span-2">
            <HeroGrid
              heroes={heroes}
              selectedHeroIds={selectedIds}
              onSelectHero={selectHero}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <TeamDraftList
            team="blue"
            teamName={state.teamNames.blue}
            teamData={blueTeam}
          />
          <TeamDraftList
            team="red"
            teamName={state.teamNames.red}
            teamData={redTeam}
          />
        </div>
      </div>
    </div>
  );
}