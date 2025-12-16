// ============================================================================
// Draft Context Provider with Pusher Integration and Format Support
// FILE: context/DraftContext.tsx
// ============================================================================
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { DraftState, DraftFormat } from '@/types';
import { usePusher } from './PusherContext';

interface DraftContextType {
  state: DraftState;
  setState: React.Dispatch<React.SetStateAction<DraftState>>;
  updateState: (newState: DraftState | ((prev: DraftState) => DraftState)) => void;
  resetDraft: () => void;
  setDraftFormat: (format: DraftFormat) => void;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

const initialState: DraftState = {
  currentStep: 0,
  selections: {},
  teamNames: { blue: 'Team Blue', red: 'Team Red' },
  timeLeft: 30,
  isTimerRunning: false,
  draftFormat: 'normal', // Default format
};

export function DraftProvider({ children }: { children: ReactNode }) {
  const { isConnected, subscribe, unsubscribe, broadcast } = usePusher();
  const [state, setState] = useState<DraftState>(() => {
    // Load from localStorage on initial mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('draftState');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('📦 Loaded state from localStorage');
          return parsed;
        } catch (e) {
          console.error('❌ Failed to parse saved state:', e);
        }
      }
    }
    return initialState;
  });

  // Track if update is from Pusher to prevent infinite loops
  const isPusherUpdate = useRef(false);
  const hasRequestedState = useRef(false);

  // Request current state from server when connected (only once)
  useEffect(() => {
    if (isConnected && !hasRequestedState.current) {
      console.log('📥 Requesting current state from server...');
      hasRequestedState.current = true;
      
      // Request state via API
      fetch('/api/pusher/get-state')
        .then(res => res.json())
        .then(data => {
          if (data.state) {
            console.log('📥 Received state from server:', data.state);
            isPusherUpdate.current = true;
            setState(data.state);
          } else {
            console.log('📭 No state available on server');
          }
        })
        .catch(err => {
          console.error('❌ Failed to fetch state:', err);
        });
    }
  }, [isConnected]);

  // Listen for draft updates from other clients via Pusher
  useEffect(() => {
    if (!isConnected) {
      console.log('⚠️ Not connected to Pusher, skipping event subscription');
      return;
    }

    console.log('👂 Setting up Pusher event listeners...');

    const handleDraftUpdate = (data: { state: DraftState }) => {
      console.log('📡 Received draft update from Pusher:', data);
      isPusherUpdate.current = true;
      setState(data.state);
    };

    const handleDraftReset = () => {
      console.log('🔄 Received draft reset from Pusher');
      isPusherUpdate.current = true;
      setState(initialState);
      
      // Also clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('draftState');
      }
    };

    // Subscribe to events
    subscribe('draft:update', handleDraftUpdate);
    subscribe('draft:reset', handleDraftReset);

    return () => {
      console.log('🧹 Cleaning up Pusher event listeners');
      unsubscribe('draft:update', handleDraftUpdate);
      unsubscribe('draft:reset', handleDraftReset);
    };
  }, [isConnected, subscribe, unsubscribe]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('draftState', JSON.stringify(state));
        console.log('💾 Saved state to localStorage');
      } catch (e) {
        console.error('❌ Failed to save state to localStorage:', e);
      }
    }
    
    // Reset the Pusher update flag after state update
    isPusherUpdate.current = false;
  }, [state]);

  // Function to update state AND broadcast to other clients via Pusher
  const updateState = (newState: DraftState | ((prev: DraftState) => DraftState)) => {
    const resolvedState = typeof newState === 'function' ? newState(state) : newState;
    
    console.log('🔄 Updating state:', resolvedState);
    
    // Update local state
    setState(resolvedState);
    
    // Only broadcast if this is NOT from a Pusher update (prevent infinite loop)
    if (!isPusherUpdate.current && isConnected) {
      console.log('📤 Broadcasting draft update to Pusher');
      broadcast('draft:update', { state: resolvedState });
    } else if (!isConnected) {
      console.warn('⚠️ Not connected to Pusher, state change not broadcasted');
    }
  };

  // Function to reset the entire draft
  const resetDraft = () => {
    console.log('🔄 Resetting draft to initial state');
    
    // Update local state
    setState(initialState);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('draftState');
    }
    
    // Broadcast reset to other clients
    if (isConnected) {
      console.log('📤 Broadcasting draft reset to Pusher');
      broadcast('draft:reset', {});
    } else {
      console.warn('⚠️ Not connected to Pusher, reset not broadcasted');
    }
  };

  // Function to change draft format
  const setDraftFormat = (format: DraftFormat) => {
    console.log('🎮 Setting draft format to:', format);
    
    updateState(prev => ({
      ...prev,
      draftFormat: format,
      currentStep: 0, // Reset to step 0 when format changes
      selections: {}, // Clear selections when format changes
    }));
  };

  return (
    <DraftContext.Provider value={{ state, setState, updateState, resetDraft, setDraftFormat }}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDraftContext() {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDraftContext must be used within DraftProvider');
  }
  return context;
}