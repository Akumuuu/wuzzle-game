import React from 'react';
import { SunIcon, MoonIcon, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onHelpClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  toggleDarkMode,
  onHelpClick
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700 py-4 px-6">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        <div className="flex-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full text-slate-700 dark:text-slate-200"
            onClick={onHelpClick}
            aria-label="How to play"
          >
            <HelpCircle size={22} />
          </motion.button>
        </div>
        <h1 className="text-2xl font-bold text-center text-teal-600 dark:text-teal-400 flex-1">
          <motion.span
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            WUZZLE
          </motion.span>
        </h1>
        <div className="flex-1 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full text-slate-700 dark:text-slate-200"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <SunIcon size={22} /> : <MoonIcon size={22} />}
          </motion.button>
        </div>
      </div>
    </header>
  );
};