import { motion } from 'framer-motion';
import type { MoodConfig, PlaylistResponse } from '../types';
import { PlaylistCard } from './PlaylistCard';
import { RefreshCw } from 'lucide-react';

interface PlaylistViewProps {
  mood: MoodConfig;
  playlist: PlaylistResponse;
  onReset: () => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

export const PlaylistView = ({ mood, playlist, onReset }: PlaylistViewProps) => {
  return (
    <motion.div
      key="playlist"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto w-full px-4 py-12"
    >
      <div className="flex flex-col items-center text-center mb-12">
        <div 
          className="inline-flex items-center justify-center w-20 h-20 text-5xl mb-6 liquid-glass rounded-full border-t border-l"
          style={{ borderColor: mood.glowColor, boxShadow: `0 0 30px ${mood.glowColor}40` }}
        >
          {mood.emoji}
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
          Your <span style={{ color: mood.glowColor }}>{mood.label}</span> Playlist
        </h2>
        <p className="text-xl text-slate-600 font-light max-w-2xl">
          {playlist.vibeDescription}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 mb-12"
      >
        {playlist.songs.map((song, index) => (
          <PlaylistCard key={index} song={song} index={index} />
        ))}
      </motion.div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-4 rounded-full liquid-glass hover:bg-white/40 transition-all hover:scale-105 active:scale-95 text-lg font-medium group"
        >
          <RefreshCw size={20} className="group-hover:-rotate-180 transition-transform duration-500 text-orange-400" />
          <span>Try Another Mood</span>
        </button>
      </div>
    </motion.div>
  );
};
