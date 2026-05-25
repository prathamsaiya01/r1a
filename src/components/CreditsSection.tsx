import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { credits } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

export default function CreditsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.credit-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: creditsRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black py-32"
      id="credits"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(229,9,20,0.08) 0%, transparent 70%)' }} className="w-full h-full" />
      </div>

      {/* Top line */}
      <motion.div
        className="w-64 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent mb-16"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      {/* NEXUS title */}
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'backOut' }}
      >
        <h2 className="font-cinzel text-7xl md:text-[120px] font-black text-white glow-red animate-flicker tracking-widest">
          HER
        </h2>
        <p className="font-cinzel text-xs tracking-[0.6em] text-red-500/60 uppercase mt-3">
          Our Love Story
        </p>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="font-cinzel text-white/30 text-sm tracking-widest uppercase mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        With Infinite Love · Forever
      </motion.p>

      {/* Credits list */}
      <div ref={creditsRef} className="text-center space-y-10 max-w-lg px-8">
        {credits.map((credit) => (
          <div key={credit.role} className="credit-item">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-red-500/50 uppercase mb-1">{credit.role}</p>
            <p className="font-cinzel text-2xl font-bold text-white">{credit.name}</p>
          </div>
        ))}
      </div>

      {/* Bottom decorative line */}
      <motion.div
        className="w-64 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent mt-20"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Final tagline */}
      <motion.p
        className="mt-16 font-bebas text-4xl md:text-6xl text-white/10 tracking-[0.3em]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        FOREVER
      </motion.p>

      <motion.p
        className="mt-8 font-cinzel text-xs tracking-[0.4em] text-white/20 uppercase"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
      >
        Made with Love · For Her · Always
      </motion.p>

      {/* Scanline effect */}
      <div className="scanline opacity-20" />
    </section>
  );
}
