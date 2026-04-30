import { motion } from 'framer-motion';
import type { MoodConfig } from '../types';
import { MoodOrb } from './MoodOrb';

interface MoodGridProps {
  moods: MoodConfig[];
  selectedMoodId: string | null;
  onSelectMood: (id: string) => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export const MoodGrid = ({ moods, selectedMoodId, onSelectMood }: MoodGridProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mx-auto px-4"
    >
      {moods.map((mood) => (
        <MoodOrb
          key={mood.id}
          mood={mood}
          isSelected={selectedMoodId === mood.id}
          hasSelection={selectedMoodId !== null}
          onSelect={onSelectMood}
        />
      ))}
    </motion.div>
  );
};
