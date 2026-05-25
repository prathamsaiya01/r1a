import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profiles } from '../data/content';

interface Props {
  onSelect: (profile: typeof profiles[0]) => void;
}

export default function ProfileSelector({ onSelect }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (profile: typeof profiles[0]) => {
    setSelectedId(profile.id);
    setTimeout(() => onSelect(profile), 800);
  };

  return (
    <motion.section
      className="fixed inset-0 z-[99980] flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(229,9,20,0.06) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="font-cinzel text-xs tracking-[0.5em] text-red-500/60 uppercase mb-4">Welcome to Our Love</p>
        <h2 className="font-cinzel text-4xl md:text-6xl font-black text-white">
          Choose Your Vibe
        </h2>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-10 px-4">
        {profiles.map((profile, i) => (
          <motion.div
            key={profile.id}
            data-hover
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: 'backOut' }}
            className="flex flex-col items-center gap-4 cursor-pointer group"
            onHoverStart={() => setHoveredId(profile.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() => handleSelect(profile)}
          >
            <motion.div
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden"
              animate={{
                scale: hoveredId === profile.id ? 1.1 : 1,
                boxShadow: hoveredId === profile.id
                  ? `0 0 30px ${profile.color}, 0 0 60px ${profile.color}40`
                  : '0 0 0px transparent',
              }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <AnimatePresence>
                {selectedId === profile.id && (
                  <motion.div
                    className="absolute inset-0 bg-black/80 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Overlay shimmer on hover */}
              <motion.div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${profile.color}20, transparent)` }}
                animate={{ opacity: hoveredId === profile.id ? 1 : 0 }}
              />
            </motion.div>

            <motion.span
              className="font-cinzel text-sm tracking-widest uppercase"
              animate={{ color: hoveredId === profile.id ? '#ffffff' : 'rgba(255,255,255,0.5)' }}
            >
              {profile.name}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <motion.button
        data-hover
        className="mt-16 font-cinzel text-xs tracking-[0.4em] text-white/30 uppercase hover:text-red-500/70 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => onSelect(profiles[0])}
      >
        Manage Profiles
      </motion.button>
    </motion.section>
  );
}
