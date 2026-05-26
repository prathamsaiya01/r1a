import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featuredFilms } from '../data/content';
import CinematicCard from './CinematicCard';

gsap.registerPlugin(ScrollTrigger);

export default function ShowcaseSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    // Respect reduced motion and only enable heavy pinning on large screens
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLargeScreen = window.innerWidth >= 1024;
    if (prefersReducedMotion || !isLargeScreen) return;

    const scrollAmount = track.scrollWidth - track.clientWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollAmount * 1.5}`,
          scrub: 1,
          pin: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black" id="showcase">
      {/* Header */}
      <div className="px-8 md:px-16 pt-20 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-end gap-4 mb-2"
        >
          <span className="h-px bg-red-600 w-12" />
          <span className="font-cinzel text-xs tracking-[0.5em] text-red-500/70 uppercase">Moments We Share</span>
        </motion.div>
        <motion.h2
          className="font-bebas text-6xl md:text-8xl text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Our Story
        </motion.h2>
      </div>

      {/* Horizontal scroll container */}
      <div className="relative px-8 md:px-16 pb-20">
        <div ref={trackRef} className="flex gap-6 w-max">
          {featuredFilms.map((film, i) => (
            <CinematicCard key={film.id} film={film} index={i} />
          ))}
          {/* Extra spacer card */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex-shrink-0 w-72 md:w-80 flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]"
          >
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full border border-red-600/30 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <span className="font-bebas text-3xl text-red-500">+</span>
              </div>
              <p className="font-cinzel text-sm tracking-widest text-white/30 uppercase">More Love</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Side fade */}
      <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, black, transparent)' }} />
    </section>
  );
}
