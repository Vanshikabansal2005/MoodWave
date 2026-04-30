import { motion } from 'framer-motion';
import type { MoodConfig } from '../types';
import { useState } from 'react';

interface LoadingPulseProps {
  mood: MoodConfig;
}

const QUOTES = [
  "Music is the emotional life of most people.",
  "Where words fail, music speaks.",
  "Without music, life would be a mistake.",
  "Music gives a soul to the universe, wings to the mind.",
  "Music acts like a magic key, to which the most tightly closed heart opens.",
  "Music can change the world because it can change people."
];

export const LoadingPulse = ({ mood }: LoadingPulseProps) => {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
    >
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="text-8xl mb-8 drop-shadow-2xl"
      >
        {mood.emoji}
      </motion.div>

      <div className="flex items-center gap-2 h-16 mb-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 rounded-full bg-gradient-to-t from-rose-500 to-orange-400"
            style={{
              animation: `waveBar 1s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>

      <h2 className="text-2xl md:text-3xl font-medium mb-4 flex items-center gap-1">
        Curating your <span style={{ color: mood.glowColor }} className="mx-2 font-bold">{mood.label}</span> playlist
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >...</motion.span>
      </h2>

      <p className="text-slate-600 font-serif italic max-w-md mx-auto text-lg">
        "{quote}"
      </p>
    </motion.div>
  );
};
