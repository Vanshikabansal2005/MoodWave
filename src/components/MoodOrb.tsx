import { motion } from 'framer-motion';
import type { MoodConfig } from '../types';

interface MoodOrbProps {
  mood: MoodConfig;
  isSelected: boolean;
  hasSelection: boolean;
  onSelect: (id: string) => void;
}

const orbVariants = {
  hidden: { opacity: 0, scale: 0.6, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 200 } }
};

export const MoodOrb = ({ mood, isSelected, hasSelection, onSelect }: MoodOrbProps) => {
  return (
    <motion.button
      variants={orbVariants}
      onClick={() => onSelect(mood.id)}
      
      className={`
        liquid-glass group flex flex-col items-center justify-center p-6 gap-3 
        transition-all duration-300 relative
        ${hasSelection && !isSelected ? 'opacity-40 scale-95' : 'hover:scale-[1.08]'}
        ${isSelected ? `scale-[1.12] !bg-orange-500 !border-orange-600 shadow-orange-500/50 glow-pulse` : ''}
      `}
      style={{ animation: !isSelected ? 'floatOrb 4s ease-in-out infinite' : 'none', animationDelay: `${(mood.id.charCodeAt(0) % 5) * 0.1}s` }}
    >
      <motion.div
        className="text-4xl md:text-5xl"
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
        transition={{ type: "spring" as const, stiffness: 300 }}
      >
        {mood.emoji}
      </motion.div>
      <span className={`font-medium tracking-wide ${isSelected ? 'text-white' : 'text-slate-900'}`}>
        {mood.label}
      </span>
      {isSelected && (
        <>
          <div className="absolute inset-0 ripple-effect rounded-2xl pointer-events-none" style={{ color: mood.glowColor }} />
          <div className="shimmer-effect rounded-2xl pointer-events-none" />
        </>
      )}
    </motion.button>
  );
};
