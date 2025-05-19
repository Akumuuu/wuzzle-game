import React from 'react';
import { WORD_LENGTH, MAX_GUESSES, checkGuess } from '../utils/gameLogic';
import { GameState } from '../types/game';
import { motion } from 'framer-motion';

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { guesses, currentGuess, solution } = gameState;
  
  // Create rows for all guesses including current and empty ones
  const rows = [...Array(MAX_GUESSES)].map((_, i) => {
    // Return submitted guesses with correct states
    if (i < guesses.length) {
      const guess = guesses[i];
      const letterStates = checkGuess(guess, solution);
      
      return (
        <div key={i} className="grid grid-cols-5 gap-2 mb-2">
          {guess.split('').map((letter, j) => (
            <Cell 
              key={j} 
              letter={letter} 
              state={letterStates[j]} 
              delay={j * 0.15} 
              isRevealing={true}
              position={j}
              rowIndex={i}
            />
          ))}
        </div>
      );
    }
    
    // Return current guess (no state yet)
    if (i === guesses.length) {
      const currentGuessLetters = currentGuess.split('');
      
      return (
        <div key={i} className="grid grid-cols-5 gap-2 mb-2">
          {[...Array(WORD_LENGTH)].map((_, j) => (
            <Cell 
              key={j} 
              letter={currentGuessLetters[j] || ''} 
              state="empty"
              position={j}
              rowIndex={i}
              isTyping={!!currentGuessLetters[j]}
            />
          ))}
        </div>
      );
    }
    
    // Return empty cells for future guesses
    return (
      <div key={i} className="grid grid-cols-5 gap-2 mb-2">
        {[...Array(WORD_LENGTH)].map((_, j) => (
          <Cell 
            key={j} 
            letter="" 
            state="empty"
            position={j}
            rowIndex={i}
          />
        ))}
      </div>
    );
  });

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      {rows}
    </div>
  );
};

interface CellProps {
  letter: string;
  state: string;
  isRevealing?: boolean;
  isTyping?: boolean;
  delay?: number;
  position: number;
  rowIndex: number;
}

const Cell: React.FC<CellProps> = ({ 
  letter, 
  state, 
  isRevealing = false,
  isTyping = false,
  delay = 0,
  position,
  rowIndex
}) => {
  // Determine cell background color based on state
  const getCellStyle = () => {
    switch (state) {
      case 'correct':
        return 'bg-emerald-500 text-white border-emerald-500';
      case 'present':
        return 'bg-amber-500 text-white border-amber-500';
      case 'absent':
        return 'bg-slate-700 text-white border-slate-700';
      default:
        return letter 
          ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white' 
          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600';
    }
  };

  // Animation variants for revealing letters
  const revealVariants = {
    initial: { 
      rotateX: 0,
      scale: 1
    },
    reveal: { 
      rotateX: 360,
      scale: [1, 1.1, 1],
      transition: { 
        duration: 0.8,
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    }
  };

  // Animation for typing letters
  const typeVariants = {
    initial: { 
      scale: 0.8,
      opacity: 0
    },
    type: { 
      scale: [0.8, 1.1, 1],
      opacity: 1,
      transition: {
        duration: 0.3,
        type: 'spring',
        stiffness: 400,
        damping: 20
      }
    }
  };

  // Animation for empty cells
  const emptyVariants = {
    initial: { 
      scale: 0.8,
      opacity: 0
    },
    show: { 
      scale: 1,
      opacity: 1,
      transition: {
        delay: rowIndex * 0.1 + position * 0.05,
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate={isRevealing ? "reveal" : isTyping ? "type" : "show"}
      variants={isRevealing ? revealVariants : isTyping ? typeVariants : emptyVariants}
      className={`
        w-full aspect-square flex items-center justify-center 
        text-2xl font-bold uppercase border-2 rounded
        ${getCellStyle()}
        transform transition-colors duration-300
      `}
    >
      {letter}
    </motion.div>
  );
};