// ============================================================================
// useDraft Hook with Pusher Integration
// FILE: hooks/useDraft.ts
// ============================================================================
'use client';

import { useEffect, useCallback } from 'react';
import { Hero, TeamData } from '@/types';
import { DRAFT_PHASES } from '@/lib/DraftPhases';
import { useDraftContext } from '@/context/DraftContext';
import { usePusher } from '@/context/PusherContext';

export function useDraft(heroes: Hero[]) {
  const { state, setState, updateState, resetDraft: contextResetDraft } = useDraftContext();
  const { isConnected, broadcast } = usePusher();

  // Timer effect - Use setState (local only) to avoid broadcasting every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isTimerRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        // Use setState instead of updateState for timer
        // This updates locally without broadcasting to Pusher every second
        setState(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 1)
        }));
      }, 1000);
    } else if (state.timeLeft === 0) {
      setState(prev => ({ ...prev, isTimerRunning: false }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isTimerRunning, state.timeLeft, setState]);

  // Sync timer to Pusher every 5 seconds instead of every second
  useEffect(() => {
    if (!state.isTimerRunning || !isConnected) return;

    const syncInterval = setInterval(() => {
      console.log('⏱️ Syncing timer state to Pusher');
      broadcast('draft:update', { state });
    }, 5000); // Sync every 5 seconds

    return () => clearInterval(syncInterval);
  }, [state.isTimerRunning, isConnected, state, broadcast]);

  // Select a hero and move to next step
  const selectHero = useCallback((heroId: number) => {
    console.log('🎯 Selecting hero:', heroId);
    
    updateState(prev => {
      const newSelections = { ...prev.selections, [prev.currentStep]: heroId };
      const newStep = prev.currentStep < DRAFT_PHASES.length - 1 
        ? prev.currentStep + 1 
        : prev.currentStep;
      
      return {
        ...prev,
        selections: newSelections,
        currentStep: newStep,
        timeLeft: 30,
      };
    });
  }, [updateState]);

  // Move to next step
  const nextStep = useCallback(() => {
    console.log('➡️ Moving to next step');
    
    updateState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, DRAFT_PHASES.length - 1),
      timeLeft: 30,
    }));
  }, [updateState]);

  // Move to previous step
  const previousStep = useCallback(() => {
    console.log('⬅️ Moving to previous step');
    
    updateState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      timeLeft: 30,
    }));
  }, [updateState]);

  // Reset the entire draft
  const resetDraft = useCallback(() => {
    console.log('🔄 Resetting draft');
    
    // Use the context's reset function which handles both local and broadcast
    contextResetDraft();
  }, [contextResetDraft]);

  // Toggle timer on/off
  const toggleTimer = useCallback(() => {
    console.log('⏯️ Toggling timer');
    
    updateState(prev => ({
      ...prev,
      isTimerRunning: !prev.isTimerRunning,
    }));
  }, [updateState]);

  // Set team name
  const setTeamName = useCallback((team: 'blue' | 'red', name: string) => {
    console.log(`📝 Setting ${team} team name to:`, name);
    
    updateState(prev => ({
      ...prev,
      teamNames: { ...prev.teamNames, [team]: name },
    }));
  }, [updateState]);

  // Get hero by ID
  const getHeroById = useCallback((id: number): Hero | null => {
    return heroes.find(h => h.id === id) || null;
  }, [heroes]);

  // Get team data with hero information
  const getTeamData = useCallback((team: 'blue' | 'red'): TeamData[] => {
    return DRAFT_PHASES.map((draft, idx) => ({
      ...draft,
      hero: state.selections[idx] ? getHeroById(state.selections[idx]) : null,
      isActive: idx === state.currentStep,
      index: idx,
    })).filter(d => d.team === team);
  }, [state.selections, state.currentStep, getHeroById]);

  const currentDraft = DRAFT_PHASES[state.currentStep];

  return {
    state,
    currentDraft,
    selectHero,
    nextStep,
    previousStep,
    resetDraft,
    toggleTimer,
    setTeamName,
    getHeroById,
    getTeamData,
    isConnected, // Expose connection status
  };
}