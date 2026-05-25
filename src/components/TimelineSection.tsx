import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { timelineEvents } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the vertical line
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          },
        }
      );

      // Animate each event
      gsap.fromTo('.timeline-event',
        { opacity: 0, x: (i) => i % 2 === 0 ? -60 : 60 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 bg-black overflow-hidden" id="timeline">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(229,9,20,0.04) 0%, transparent 60%)' }} />

      <div className="px-8 md:px-16 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-end gap-4 mb-2"
        >
          <span className="h-px bg-red-600 w-12" />
          <span className="font-cinzel text-xs tracking-[0.5em] text-red-500/70 uppercase">The Story So Far</span>
        </motion.div>
        <motion.h2
          className="font-bebas text-6xl md:text-8xl text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our Journey
        </motion.h2>
      </div>

      {/* Timeline */}
      <div className="relative max-w-5xl mx-auto px-8 md:px-16">
        {/* Center line */}
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 origin-top hidden md:block"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(229,9,20,0.4) 20%, rgba(229,9,20,0.4) 80%, transparent)', transformOrigin: 'top' }}
        />

        <div className="flex flex-col gap-16">
          {timelineEvents.map((event, i) => (
            <div
              key={event.year}
              className={`timeline-event relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Content card */}
              <motion.div
                className="flex-1 glass rounded-xl p-6 glow-box-red relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                data-hover
              >
                {/* Scanline on hover */}
                <div className="scanline opacity-30" />

                <div className="flex items-center gap-3 mb-3">
                  <span className="font-bebas text-5xl text-red-500 glow-red">{event.year}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-red-600/40 to-transparent" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-white mb-3">{event.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{event.desc}</p>

                {/* Corner decoration */}
                <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20"
                  style={{ background: 'radial-gradient(circle at 100% 100%, rgba(229,9,20,0.8) 0%, transparent 70%)' }} />
              </motion.div>

              {/* Center dot */}
              <div className="relative z-10 hidden md:flex items-center justify-center flex-shrink-0">
                <motion.div
                  className="w-4 h-4 rounded-full bg-red-600 relative"
                  whileInView={{ scale: [0, 1.5, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{ boxShadow: '0 0 20px rgba(229,9,20,0.6), 0 0 40px rgba(229,9,20,0.3)' }}
                />
              </div>

              {/* Spacer */}
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
