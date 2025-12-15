'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { DraftState } from '@/types';
import { useSocket } from './socketContext';

interface DraftContextType {
  state: DraftState;
  setState: React.Dispatch<React.SetStateAction<DraftState>>;
  updateState: (newState: DraftState | ((prev: DraftState) => DraftState)) => void;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export function DraftProvider({ children }: { children: ReactNode }) {
  const { socket, isConnected } = useSocket();
  const [state, setState] = useState<DraftState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('draftState');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved state');
        }
      }
    }
    
    return {
      currentStep: 0,
      selections: {},
      teamNames: { blue: 'Team Blue', red: 'Team Red' },
      timeLeft: 30,
      isTimerRunning: false,
    };
  });

  // Track if update is from socket to prevent loop
  const isSocketUpdate = useRef(false);

  // Request current state when socket connects
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('request-state', (serverState: DraftState) => {
        if (serverState) {
          console.log('📥 Received state from server');
          isSocketUpdate.current = true;
          setState(serverState);
        }
      });
    }
  }, [socket, isConnected]);

  // Listen for draft updates from other clients
  useEffect(() => {
    if (!socket) return;

    const handleDraftUpdate = (newState: DraftState) => {
      console.log('📡 Received draft update from server');
      isSocketUpdate.current = true;
      setState(newState);
    };

    const handleDraftReset = () => {
      console.log('🔄 Received draft reset from server');
      isSocketUpdate.current = true;
      setState({
        currentStep: 0,
        selections: {},
        teamNames: { blue: 'Team Blue', red: 'Team Red' },
        timeLeft: 30,
        isTimerRunning: false,
      });
    };

    socket.on('draft:update', handleDraftUpdate);
    socket.on('draft:reset', handleDraftReset);

    return () => {
      socket.off('draft:update', handleDraftUpdate);
      socket.off('draft:reset', handleDraftReset);
    };
  }, [socket]);

  // Save to localStorage (but DON'T emit here)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('draftState', JSON.stringify(state));
    }
    // Reset the flag after state update
    isSocketUpdate.current = false;
  }, [state]);

  // New function to update state AND emit to socket
  const updateState = (newState: DraftState | ((prev: DraftState) => DraftState)) => {
    const resolvedState = typeof newState === 'function' ? newState(state) : newState;
    
    // Update local state
    setState(resolvedState);
    
    // Only emit if this is NOT from a socket update (prevent loop)
    if (!isSocketUpdate.current && socket && isConnected) {
      console.log('📤 Emitting draft update to server');
      socket.emit('draft:update', resolvedState);
    }
  };

  return (
    <DraftContext.Provider value={{ state, setState, updateState }}>
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