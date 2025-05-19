import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameMessageProps {
  message: string | null;
  isVisible: boolean;
  onDismiss: () => void;
}

export const GameMessage: React.FC<GameMessageProps> = ({ 
  message, 
  isVisible, 
  onDismiss 
}) => {
  // Close the message after a delay
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 px-4 py-2 rounded-lg shadow-lg">
            <p className="text-center font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};