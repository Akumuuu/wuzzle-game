import React from 'react';
import { LetterState } from '../types/game';
import { motion } from 'framer-motion';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardState: Record<string, LetterState>;
}

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardState }) => {
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '←']
  ];

  // Handle physical keyboard input
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        onKeyPress('Backspace');
      } else if (e.key === 'Enter') {
        onKeyPress('Enter');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        onKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  // Render the keyboard
  return (
    <div className="w-full max-w-lg mx-auto mb-4 px-2">
      {keyboardRows.map((row, i) => (
        <div 
          key={i} 
          className={`flex justify-center ${i === 1 ? 'mx-6' : ''} mb-2`}
        >
          {row.map((key) => (
            <KeyButton 
              key={key} 
              keyValue={key} 
              onClick={() => onKeyPress(key)} 
              state={keyboardState[key.toLowerCase()] || 'empty'}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

interface KeyButtonProps {
  keyValue: string;
  onClick: () => void;
  state: LetterState;
}

const KeyButton: React.FC<KeyButtonProps> = ({ keyValue, onClick, state }) => {
  // Determine button style based on state
  const getButtonStyle = () => {
    switch (state) {
      case 'correct':
        return 'bg-emerald-500 text-white';
      case 'present':
        return 'bg-amber-500 text-white';
      case 'absent':
        return 'bg-slate-700 text-white';
      default:
        return 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white';
    }
  };

  // Special styling for Enter and Backspace keys
  const isSpecialKey = keyValue === 'Enter' || keyValue === '←';
  const buttonWidth = isSpecialKey ? 'min-w-[60px]' : 'min-w-[30px]';

  return (
    <motion.button
      className={`
        ${getButtonStyle()}
        ${buttonWidth}
        m-0.5 px-2 py-4 rounded font-medium uppercase text-sm
        flex items-center justify-center
        hover:brightness-105 active:brightness-90
        transition-all duration-200
      `}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {keyValue}
    </motion.button>
  );
};