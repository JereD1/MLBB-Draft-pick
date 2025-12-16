import { DraftStep } from '@/types';

export const TOURNAMENT_PHASES: DraftStep[] = [
  // Phase 1 - Bans
  { type: 'ban', team: 'blue', phase: 1, label: 'Ban 1' },
  { type: 'ban', team: 'red', phase: 1, label: 'Ban 1' },
  { type: 'ban', team: 'blue', phase: 1, label: 'Ban 2' },
  { type: 'ban', team: 'red', phase: 1, label: 'Ban 2' },
  { type: 'ban', team: 'blue', phase: 1, label: 'Ban 3' },
  { type: 'ban', team: 'red', phase: 1, label: 'Ban 3' },
  // Phase 2 - First picks
  { type: 'pick', team: 'blue', phase: 2, label: 'Pick 1' },
  { type: 'pick', team: 'red', phase: 2, label: 'Pick 1' },
  { type: 'pick', team: 'red', phase: 2, label: 'Pick 2' },
  { type: 'pick', team: 'blue', phase: 2, label: 'Pick 2' },
  { type: 'pick', team: 'blue', phase: 2, label: 'Pick 3' },
  { type: 'pick', team: 'red', phase: 2, label: 'Pick 3' },
  // Phase 3 - Second bans
  { type: 'ban', team: 'red', phase: 3, label: 'Ban 4' },
  { type: 'ban', team: 'blue', phase: 3, label: 'Ban 4' },
  { type: 'ban', team: 'red', phase: 3, label: 'Ban 5' },
  { type: 'ban', team: 'blue', phase: 3, label: 'Ban 5' },

  // Phase 4 - Final picks
  { type: 'pick', team: 'red', phase: 4, label: 'Pick 4' },
  { type: 'pick', team: 'blue', phase: 4, label: 'Pick 4' },
  { type: 'pick', team: 'blue', phase: 4, label: 'Pick 4' },
  { type: 'pick', team: 'red', phase: 4, label: 'Pick 5' },
];