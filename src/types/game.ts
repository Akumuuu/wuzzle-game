export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface GameState {
  solution: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  keyboardState: Record<string, LetterState>;
  message: string | null;
  showMessage: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastPlayedDate: string | null;
}