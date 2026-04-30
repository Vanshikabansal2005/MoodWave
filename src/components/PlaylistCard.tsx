import { motion } from 'framer-motion';
import type { Song } from '../types';
import { Play } from 'lucide-react';

interface PlaylistCardProps {
  song: Song;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.07, duration: 0.4 }
  })
};

export const PlaylistCard = ({ song, index }: PlaylistCardProps) => {
  const handlePlay = () => {
    // Show toast (simple implementation using window.alert or custom toast - we'll just use a small DOM element injection or assume it's handled, wait prompt says "show a brief glass toast", let's implement a custom global toast later or just simple alert for now. Let's create a custom toast.)
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 liquid-glass px-6 py-3 text-slate-900 z-50 flex items-center gap-2 animate-bounce';
    toast.innerHTML = '✨ Opening YouTube...';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity');
      setTimeout(() => toast.remove(), 300);
    }, 2000);

    const query = encodeURIComponent(`${song.title} ${song.artist}`);
    window.open(`https://youtube.com/search?q=${query}`, '_blank');
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="liquid-glass p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:bg-white/40 transition-colors group"
    >
      <div className="flex items-start gap-4 flex-1">
        <div className="text-2xl font-serif text-orange-500/50 font-bold min-w-[32px]">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-300 transition-colors">
              {song.title}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/40 border border-white/60 text-slate-700 uppercase tracking-wider backdrop-blur-sm">
              {song.genre}
            </span>
          </div>
          <p className="text-slate-600 text-sm">{song.artist}</p>
          <p className="text-slate-600 text-sm mt-2 italic border-l-2 border-orange-500/50 pl-3">
            "{song.vibeNote}"
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0 border-t border-white/40 md:border-none pt-4 md:pt-0">
        <div className="flex items-end gap-1 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 rounded-t-sm bg-orange-400"
              style={{
                height: `${Math.random() * 100}%`,
                animation: `waveBar ${0.5 + Math.random()}s ease-in-out infinite alternate`
              }}
            />
          ))}
        </div>
        
        <button
          onClick={handlePlay}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 hover:bg-white/60 border border-white/60 transition-all hover:scale-105 active:scale-95 text-sm font-medium"
        >
          <Play size={16} className="text-slate-600" />
          <span>Play</span>
        </button>
      </div>
    </motion.div>
  );
};
