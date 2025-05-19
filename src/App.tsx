import React, { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { GameMessage } from './components/GameMessage';
import { GameControls } from './components/GameControls';
import { Header } from './components/Header';
import { HowToPlay } from './components/HowToPlay';
import { useGameState } from './hooks/useGameState';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('darkMode') === 'true' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(
    localStorage.getItem('hasPlayedBefore') !== 'true'
  );

  // Load words from JSON file
  useEffect(() => {
    fetch('/words.json')
      .then(response => response.json())
      .then(data => {
        setWords(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error loading words:", error);
        setIsLoading(false);
      });
  }, []);

  // Initialize game state once words are loaded
  const { 
    gameState, 
    gameStats, 
    handleKeyPress, 
    dismissMessage,
    shareResults,
    startNewGame
  } = useGameState({ validWords: words });

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  // Handle first time tutorial
  const closeHowToPlay = () => {
    setShowHowToPlay(false);
    localStorage.setItem('hasPlayedBefore', 'true');
  };

  // Update document with dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (isLoading || !gameState) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-teal-600 dark:text-teal-400 text-2xl font-bold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-white flex flex-col">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        onHelpClick={() => setShowHowToPlay(true)}
      />
      
      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col"
          >
            <GameBoard gameState={gameState} />
            
            <div className="mt-auto">
              <GameControls 
                gameState={gameState}
                gameStats={gameStats}
                onShare={shareResults}
                onNewGame={startNewGame}
              />
              
              <Keyboard 
                onKeyPress={handleKeyPress} 
                keyboardState={gameState.keyboardState}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      
      <GameMessage 
        message={gameState.message} 
        isVisible={gameState.showMessage}
        onDismiss={dismissMessage}
      />

      <HowToPlay 
        isOpen={showHowToPlay}
        onClose={closeHowToPlay}
      />
    </div>
  );
}

export default App;