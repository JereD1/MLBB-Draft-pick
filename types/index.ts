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
  
  export interface DraftState {
    currentStep: number;
    selections: { [key: number]: number }; // step index -> hero id
    teamNames: {
      blue: string;
      red: string;
    };
    timeLeft: number;
    isTimerRunning: boolean;
  }
  
  export interface TeamData extends DraftStep {
    hero: Hero | null;
    isActive: boolean;
    index: number;
  }