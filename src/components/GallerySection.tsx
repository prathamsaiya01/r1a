import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type GalleryItem = {
  id: number;
  src: string;
  label: string;
  type: 'image' | 'video';
};

interface Props {
  items: GalleryItem[];
}

export default function GallerySection({ items }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gallery-item',
        { opacity: 0, scale: 0.85, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 bg-black overflow-hidden" id="gallery">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(229,9,20,0.05) 0%, transparent 70%)' }} />

      <div className="px-8 md:px-16 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-end gap-4 mb-2"
        >
          <span className="h-px bg-red-600 w-12" />
          <span className="font-cinzel text-xs tracking-[0.5em] text-red-500/70 uppercase">Captured Moments</span>
        </motion.div>
        <motion.h2
          className="font-bebas text-6xl md:text-8xl text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Beautiful Moments
        </motion.h2>
      </div>

      {/* Masonry-style grid */}
      <div className="px-8 md:px-16 grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((img, i) => (
          <motion.div
            key={img.id}
            className={`gallery-item relative rounded-xl overflow-hidden cursor-pointer group ${
              i === 0 || i === 3 ? 'md:row-span-2' : ''
            }`}
            style={{ aspectRatio: i === 0 || i === 3 ? '4/5' : '16/9' }}
            onClick={() => setActiveId(activeId === img.id ? null : img.id)}
            data-hover
          >
            {img.type === 'image' ? (
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ filter: 'brightness(0.7) saturate(0.8)' }}
              />
            ) : (
              <video
                src={img.src}
                className="w-full h-full object-cover"
                controls
                muted
                loop
                playsInline
              />
            )}

            {/* Overlay */}
            <motion.div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}
              animate={{ opacity: activeId === img.id ? 1 : 0.6 }}
            />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="font-cinzel text-xs tracking-[0.3em] text-red-400 uppercase mb-1">{img.label}</p>
            </div>

            {/* Neon border on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 30px rgba(229,9,20,0.2), 0 0 20px rgba(229,9,20,0.15)' }} />

            {/* Red corner accent */}
            <motion.div
              className="absolute top-3 right-3 w-1 h-8 bg-red-600 rounded-full opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute top-3 right-3 w-8 h-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating text */}
      <motion.div
        className="absolute right-8 md:right-16 top-1/2 hidden xl:block"
        style={{ writingMode: 'vertical-rl', letterSpacing: '0.5em' }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="font-cinzel text-[10px] text-white/10 uppercase">Every Frame A Painting</span>
      </motion.div>
    </section>
  );
}
