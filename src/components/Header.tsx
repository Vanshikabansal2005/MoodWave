import { motion } from 'framer-motion';

export const Header = () => {
  const title = "MoodWave".split('');

  return (
    <div className="text-center mb-12 select-none">
      <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 flex justify-center tracking-tight">
        {title.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.5,
              type: 'spring',
              stiffness: 150
            }}
            className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-600 drop-shadow-md"
          >
            {char}
          </motion.span>
        ))}
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-slate-600 text-lg md:text-xl font-light tracking-wide"
      >
        Tell us how you feel. We'll build your soundtrack.
      </motion.p>
    </div>
  );
};
