import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { MoodGrid } from './components/MoodGrid';
import { LoadingPulse } from './components/LoadingPulse';
import { PlaylistView } from './components/PlaylistView';
import { MOODS } from './utils/moodConfig';
import { useGemini } from './hooks/useGemini';
import type { PlaylistResponse } from './types';
import { Sparkles, AlertCircle } from 'lucide-react';

function App() {
  const [screen, setScreen] = useState<0 | 1 | 2>(0); // 0: Selection, 1: Loading, 2: Results
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
  
  const { generatePlaylist, error } = useGemini();

  const selectedMood = MOODS.find(m => m.id === selectedMoodId) || MOODS[0];

  const handleMouseMove = (e: MouseEvent) => {
    const root = document.documentElement;
    root.style.setProperty('--mouse-x', `${e.clientX}px`);
    root.style.setProperty('--mouse-y', `${e.clientY}px`);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGenerate = async () => {
    if (!selectedMoodId) return;
    setScreen(1);
    
    const result = await generatePlaylist(selectedMood.label);
    
    if (result) {
      setPlaylist(result);
      setScreen(2);
    } else {
      // Stay on loading screen but show error via the error state in useGemini
      // Actually if it fails, it will just stick on loading screen, but we should show the error.
    }
  };

  const handleReset = () => {
    setScreen(0);
    setSelectedMoodId(null);
    setPlaylist(null);
  };

  return (
    <div className="min-h-screen mesh-bg relative selection:bg-orange-500/30 font-sans">
      <div className="cursor-glow hidden md:block" />
      
      <main className="container mx-auto px-4 py-12 md:py-24 relative z-10 flex flex-col min-h-screen">
        <AnimatePresence mode="wait">
          {screen === 0 && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col flex-1"
            >
              <Header />
              
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <MoodGrid
                  moods={MOODS}
                  selectedMoodId={selectedMoodId}
                  onSelectMood={setSelectedMoodId}
                />
                
                <div className="mt-16 h-20">
                  <AnimatePresence>
                    {selectedMoodId && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGenerate}
                        className="liquid-glass px-8 py-4 rounded-full flex items-center gap-3 group border border-orange-500/30 glow-pulse bg-white/30 hover:bg-white/40 transition-all text-lg font-medium text-slate-900 shadow-orange-500/20"
                      >
                        Generate My Playlist
                        <Sparkles size={20} className="text-orange-400 group-hover:rotate-12 transition-transform" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {screen === 1 && !error && (
            <LoadingPulse mood={selectedMood} />
          )}

          {screen === 1 && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-8"
            >
              <div className="liquid-glass p-8 max-w-lg w-full flex flex-col items-center gap-6 border border-red-500/30">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mb-2">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900">Oops, the vibe check failed.</h3>
                <p className="text-slate-700/80">{error}</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-full bg-white/40 hover:bg-white/60 border border-white/60 transition-all flex items-center gap-2 mt-4 text-slate-900"
                >
                  <Sparkles size={18} />
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {screen === 2 && playlist && (
            <PlaylistView
              mood={selectedMood}
              playlist={playlist}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
