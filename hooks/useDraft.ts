'use client';

import { useEffect, useCallback } from 'react';
import { Hero, TeamData } from '@/types';
import { DRAFT_PHASES } from '@/lib/DraftPhases';
import { useDraftContext } from '@/context/DraftContext';
import { useSocket } from '@/context/socketContext';

export function useDraft(heroes: Hero[]) {
  const { state, setState, updateState } = useDraftContext();
  const { socket } = useSocket();

  // Timer effect - Use setState (local only) to avoid emitting every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isTimerRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        // Use setState instead of updateState for timer
        // This updates locally without emitting to socket every second
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

  // Sync timer to socket every 5 seconds instead of every second
  useEffect(() => {
    if (!state.isTimerRunning) return;

    const syncInterval = setInterval(() => {
      if (socket) {
        socket.emit('draft:update', state);
      }
    }, 5000); // Sync every 5 seconds

    return () => clearInterval(syncInterval);
  }, [state.isTimerRunning, socket, state]);

  const selectHero = useCallback((heroId: number) => {
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

  const nextStep = useCallback(() => {
    updateState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, DRAFT_PHASES.length - 1),
      timeLeft: 30,
    }));
  }, [updateState]);

  const previousStep = useCallback(() => {
    updateState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      timeLeft: 30,
    }));
  }, [updateState]);

  const resetDraft = useCallback(() => {
    const resetState = {
      currentStep: 0,
      selections: {},
      teamNames: { blue: 'Team Blue', red: 'Team Red' },
      timeLeft: 30,
      isTimerRunning: false,
    };
    
    // Update local state
    updateState(resetState);
    
    // Emit reset event separately
    if (socket) {
      console.log('🔄 Emitting draft reset');
      socket.emit('draft:reset');
    }
  }, [updateState, socket]);

  const toggleTimer = useCallback(() => {
    updateState(prev => ({
      ...prev,
      isTimerRunning: !prev.isTimerRunning,
    }));
  }, [updateState]);

  const setTeamName = useCallback((team: 'blue' | 'red', name: string) => {
    updateState(prev => ({
      ...prev,
      teamNames: { ...prev.teamNames, [team]: name },
    }));
  }, [updateState]);

  const getHeroById = useCallback((id: number): Hero | null => {
    return heroes.find(h => h.id === id) || null;
  }, [heroes]);

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
  };
}