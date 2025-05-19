import React from 'react';
import { GameState, GameStats } from '../types/game';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface GameControlsProps {
  gameState: GameState;
  gameStats: GameStats;
  onShare: () => void;
  onNewGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  gameStats,
  onShare,
  onNewGame
}) => {
  const [showStats, setShowStats] = React.useState(false);

  const isGameOver = gameState.gameStatus === 'won' || gameState.gameStatus === 'lost';
  
  // Format win percentage
  const winPercentage = gameStats.gamesPlayed > 0 
    ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100)
    : 0;

  // Find the highest value in distribution for scaling
  const maxDistribution = Math.max(...gameStats.guessDistribution, 1);

  return (
    <>
      <div className="flex justify-center space-x-4 mb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg shadow-md flex items-center gap-2"
          onClick={onNewGame}
        >
          <RefreshCw size={18} />
          {isGameOver ? 'New Game' : 'Restart'}
        </motion.button>
        {isGameOver && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-md"
            onClick={onShare}
          >
            Share Results
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg shadow-md"
          onClick={() => setShowStats(true)}
        >
          Statistics
        </motion.button>
      </div>

      {/* Statistics Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-4">
              Statistics
            </h2>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {gameStats.gamesPlayed}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Played</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {winPercentage}%
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Win %</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {gameStats.currentStreak}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Current Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {gameStats.maxStreak}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Max Streak</p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-center text-slate-800 dark:text-white mb-2">
              Guess Distribution
            </h3>
            
            <div className="space-y-2 mb-6">
              {gameStats.guessDistribution.map((count, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-4 text-slate-800 dark:text-white">{index + 1}</div>
                  <div className="flex-1 ml-2">
                    <div 
                      className="bg-slate-300 dark:bg-slate-600 text-white py-1 px-2 rounded text-right"
                      style={{ 
                        width: `${Math.max(5, (count / maxDistribution) * 100)}%`,
                        backgroundColor: gameState.gameStatus === 'won' && gameState.guesses.length === index + 1 
                          ? '#10b981' // emerald-500
                          : undefined
                      }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg"
                onClick={() => setShowStats(false)}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};