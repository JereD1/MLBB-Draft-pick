// ============================================================================
// Complete Type Definitions with Draft Format Support
// FILE: types/index.ts
// ============================================================================

export interface Hero {
  id: number;
  name: string;
  image: string;
  role?: string;
}

export interface DraftStep {
  type: 'pick' | 'ban';
  team: 'blue' | 'red';
  phase: number;
  label: string;
}

export type DraftFormat = 'normal' | 'tournament';

export interface DraftState {
  currentStep: number;
  selections: { [key: number]: number }; // step index -> hero id
  teamNames: {
    blue: string;
    red: string;
  };
  timeLeft: number;
  isTimerRunning: boolean;
  draftFormat: DraftFormat; // Added for format selection
}

export interface TeamData extends DraftStep {
  hero: Hero | null;
  isActive: boolean;
  index: number;
}