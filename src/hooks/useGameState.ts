import { useState, useEffect, useCallback } from 'react';
import { GameState, GameStats } from '../types/game';
import { 
  WORD_LENGTH, 
  MAX_GUESSES,
  checkGuess, 
  isValidGuess, 
  updateKeyboardState,
  getInitialGameState
} from '../utils/gameLogic';

interface UseGameStateProps {
  validWords: string[];
}

export function useGameState({ validWords }: UseGameStateProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: Array(MAX_GUESSES).fill(0),
    lastPlayedDate: null
  });
  
  // Start a new game with a random word
  const startNewGame = useCallback(() => {
    if (!validWords || validWords.length === 0) return;
    
    const todaysSolution = validWords[Math.floor(Math.random() * validWords.length)];
    const initialState = getInitialGameState(todaysSolution);
    
    setGameState(initialState);
  }, [validWords]);
  
  // Load saved game state and stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('wuzzleStats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
    
    const savedState = localStorage.getItem('wuzzleGameState');
    if (savedState) {
      setGameState(JSON.parse(savedState));
    } else if (validWords.length > 0) {
      startNewGame();
    }
  }, [validWords, startNewGame]);
  
  // Save game state and stats to localStorage when they change
  useEffect(() => {
    if (gameState) {
      localStorage.setItem('wuzzleGameState', JSON.stringify(gameState));
    }
    localStorage.setItem('wuzzleStats', JSON.stringify(gameStats));
  }, [gameState, gameStats]);
  
  // Handle key press for the current guess
  const handleKeyPress = useCallback((key: string) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;
    
    setGameState(prevState => {
      if (!prevState) return prevState;
      
      // Handle backspace
      if (key === 'Backspace' || key === '←') {
        return {
          ...prevState,
          currentGuess: prevState.currentGuess.slice(0, -1)
        };
      }
      
      // Handle Enter
      if (key === 'Enter') {
        const currentGuess = prevState.currentGuess.toLowerCase();
        
        // Check if the word is complete
        if (currentGuess.length !== WORD_LENGTH) {
          return {
            ...prevState,
            message: 'Word must be 5 letters',
            showMessage: true
          };
        }
        
        // Check if the word is valid
        if (!isValidGuess(currentGuess, validWords)) {
          return {
            ...prevState,
            message: 'Not in word list',
            showMessage: true
          };
        }
        
        const newGuesses = [...prevState.guesses, currentGuess];
        const letterStates = checkGuess(currentGuess, prevState.solution);
        const newKeyboardState = updateKeyboardState(
          prevState.keyboardState,
          currentGuess,
          letterStates
        );
        
        let gameStatus = prevState.gameStatus;
        let message = null;
        
        // Check if game is won
        if (currentGuess === prevState.solution.toLowerCase()) {
          gameStatus = 'won';
          message = 'Splendid!';
          
          // Update stats
          const guessCount = newGuesses.length;
          const newDistribution = [...gameStats.guessDistribution];
          newDistribution[guessCount - 1]++;
          
          setGameStats(prevStats => ({
            gamesPlayed: prevStats.gamesPlayed + 1,
            gamesWon: prevStats.gamesWon + 1,
            currentStreak: prevStats.currentStreak + 1,
            maxStreak: Math.max(prevStats.maxStreak, prevStats.currentStreak + 1),
            guessDistribution: newDistribution,
            lastPlayedDate: new Date().toISOString().split('T')[0]
          }));
        } 
        // Check if game is lost
        else if (newGuesses.length >= MAX_GUESSES) {
          gameStatus = 'lost';
          message = `The word was: ${prevState.solution}`;
          
          setGameStats(prevStats => ({
            ...prevStats,
            gamesPlayed: prevStats.gamesPlayed + 1,
            currentStreak: 0,
            lastPlayedDate: new Date().toISOString().split('T')[0]
          }));
        }
        
        return {
          ...prevState,
          guesses: newGuesses,
          currentGuess: '',
          gameStatus,
          keyboardState: newKeyboardState,
          message,
          showMessage: !!message
        };
      }
      
      // Handle letter input
      if (/^[a-zA-Z]$/.test(key) && prevState.currentGuess.length < WORD_LENGTH) {
        return {
          ...prevState,
          currentGuess: prevState.currentGuess + key.toLowerCase(),
          showMessage: false
        };
      }
      
      return prevState;
    });
  }, [gameState, validWords, gameStats]);
  
  // Dismiss message
  const dismissMessage = useCallback(() => {
    setGameState(prevState => {
      if (!prevState) return prevState;
      return { ...prevState, showMessage: false };
    });
  }, []);
  
  // Share results
  const shareResults = useCallback(() => {
    if (!gameState || gameState.gameStatus === 'playing') return;
    
    const result = [
      `🎮 Wuzzle ${gameState.guesses.length}/${MAX_GUESSES}`,
      '',
      ...gameState.guesses.map(guess => {
        return guess.split('').map((letter, i) => {
          const state = checkGuess(guess, gameState.solution)[i];
          if (state === 'correct') return '🟩';
          if (state === 'present') return '🟨';
          return '⬛';
        }).join('');
      }),
      '',
      '🎯 Play now at: https://wuzzle-game.netlify.app/'
    ].join('\n');
    
    navigator.clipboard.writeText(result)
      .then(() => {
        setGameState(prevState => ({
          ...prevState!,
          message: 'Copied to clipboard!',
          showMessage: true
        }));
      })
      .catch(() => {
        setGameState(prevState => ({
          ...prevState!,
          message: 'Failed to copy',
          showMessage: true
        }));
      });
  }, [gameState]);
  
  return {
    gameState,
    gameStats,
    handleKeyPress,
    dismissMessage,
    shareResults,
    startNewGame
  };
}
