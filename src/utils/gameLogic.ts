import { LetterState, GameState } from '../types/game';

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export function checkGuess(guess: string, solution: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill('absent');
  const solutionLetters = solution.split('');
  
  // First pass: Check for correct positions
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solutionLetters[i]) {
      result[i] = 'correct';
      solutionLetters[i] = '*'; // Mark as used
    }
  }
  
  // Second pass: Check for correct letters in wrong positions
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'absent') {
      const index = solutionLetters.indexOf(guess[i]);
      if (index !== -1) {
        result[i] = 'present';
        solutionLetters[index] = '*'; // Mark as used
      }
    }
  }
  
  return result;
}

export function isValidGuess(guess: string, validWords: string[]): boolean {
  return validWords.includes(guess.toLowerCase());
}

export function updateKeyboardState(
  keyboardState: Record<string, LetterState>,
  guess: string,
  states: LetterState[]
): Record<string, LetterState> {
  const newKeyboardState = { ...keyboardState };
  
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i].toLowerCase();
    const currentState = newKeyboardState[letter] || 'empty';
    const newState = states[i];
    
    // Only update if the new state is better than the current one
    if (
      (currentState === 'empty') ||
      (currentState === 'absent' && (newState === 'present' || newState === 'correct')) ||
      (currentState === 'present' && newState === 'correct')
    ) {
      newKeyboardState[letter] = newState;
    }
  }
  
  return newKeyboardState;
}

export function getInitialGameState(solution: string): GameState {
  return {
    solution,
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    keyboardState: {},
    message: null,
    showMessage: false,
  };
}

export function getShareableResult(gameState: GameState): string {
  const { guesses, solution } = gameState;
  const title = `Wordle Clone ${guesses.length}/${MAX_GUESSES}`;
  
  const rows = guesses.map(guess => {
    return guess.split('').map((letter, i) => {
      const state = checkGuess(guess, solution)[i];
      if (state === 'correct') return '🟩';
      if (state === 'present') return '🟨';
      return '⬛';
    }).join('');
  }).join('\n');
  
  return `${title}\n\n${rows}`;
}