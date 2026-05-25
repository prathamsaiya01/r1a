import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface Props {
  onComplete: () => void;
  show: boolean;
}

export default function NetflixIntro({ onComplete, show }: Props) {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    const tl = gsap.timeline({ onComplete });

    tl.set(letterRefs.current, { opacity: 0, y: 60, rotateX: -90 })
      .to(letterRefs.current, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.07,
        duration: 0.6,
        ease: 'back.out(2)',
        delay: 0.5,
      })
      .to(lineRef.current, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, '-=0.2')
      .to(letterRefs.current, {
        textShadow: '0 0 40px #e50914, 0 0 80px #e50914, 0 0 120px rgba(229,9,20,0.5)',
        duration: 0.4,
      }, '-=0.2')
      .to({}, { duration: 1.2 })
      .to([letterRefs.current, lineRef.current], {
        opacity: 0,
        y: -30,
        stagger: 0.03,
        duration: 0.5,
        ease: 'power3.in',
      });
  }, [show, onComplete]);

  const letters = 'HER'.split('');

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99990] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Scanline */}
          <div className="scanline" />

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 40%, black 100%)' }} />

          <div className="relative flex items-end gap-2 perspective-[800px]">
            {letters.map((l, i) => (
              <span
                key={i}
                ref={(el) => { letterRefs.current[i] = el; }}
                className="font-cinzel text-[120px] md:text-[180px] font-black text-white leading-none select-none"
                style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
              >
                {l}
              </span>
            ))}
          </div>

          <div
            ref={lineRef}
            className="mt-4 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent"
            style={{ width: '320px', transform: 'scaleX(0)', transformOrigin: 'center' }}
          />

          <motion.p
            className="mt-6 font-cinzel text-sm tracking-[0.5em] text-red-500/70 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Love Personified
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
