import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                How to Play
              </h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6 text-slate-600 dark:text-slate-300">
              <p>
                Guess the word in 6 tries. After each guess, the color of the tiles will
                change to show how close your guess was to the word.
              </p>

              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className="w-12 h-12 bg-emerald-500 text-white font-bold text-2xl flex items-center justify-center rounded">
                    F
                  </div>
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-2xl flex items-center justify-center rounded">
                    L
                  </div>
                  <div className="w-12 h-12 bg-amber-500 text-white font-bold text-2xl flex items-center justify-center rounded">
                    A
                  </div>
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-2xl flex items-center justify-center rounded">
                    M
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 text-white font-bold text-2xl flex items-center justify-center rounded">
                    E
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="inline-block w-4 h-4 bg-emerald-500 rounded-sm mr-2" />
                    <strong className="text-emerald-500">Green</strong> letters are in the correct spot
                  </p>
                  <p>
                    <span className="inline-block w-4 h-4 bg-amber-500 rounded-sm mr-2" />
                    <strong className="text-amber-500">Yellow</strong> letters are in the word but in the wrong spot
                  </p>
                  <p>
                    <span className="inline-block w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm mr-2" />
                    <strong>Gray</strong> letters are not in the word
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                A new word will be available each time you start a new game. Use the keyboard
                or type to enter your guess.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};