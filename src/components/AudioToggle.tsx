import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AudioToggle() {
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.2;
    // Procedurally generated audio via Web Audio API instead of external file
    audioRef.current = audio;
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      // Use Web Audio API to create ambient drone
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.04;
      masterGain.connect(ctx.destination);

      [55, 110, 165, 220].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = freq;
        gain.gain.value = 0.3 - i * 0.05;
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
      });

      setPlaying(true);
    }
  };

  if (!mounted) return null;

  return (
    <motion.button
      data-hover
      onClick={toggle}
      className="fixed bottom-8 right-8 z-[9000] glass rounded-full p-3 text-white hover:text-red-500 transition-colors"
      style={{ boxShadow: playing ? '0 0 20px rgba(229,9,20,0.4)' : undefined }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3 }}
    >
      {playing ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </motion.button>
  );
}
