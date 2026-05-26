import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Clock } from 'lucide-react';

interface Film {
  id: number;
  title: string;
  genre: string;
  year: string;
  rating: string;
  duration: string;
  description: string;
  image: string;
  tags: string[];
}

interface Props {
  film: Film;
  index: number;
}

export default function CinematicCard({ film, index }: Props) {
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateRef.current = { x: -y * 15, y: x * 15 };
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateRef.current.x}deg) rotateY(${rotateRef.current.y}deg) scale(1.04)`;
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-shrink-0 w-72 md:w-80"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div
        ref={cardRef}
        className="relative rounded-xl overflow-hidden bg-zinc-900 cursor-pointer"
        style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setFlipped(!flipped)}
        data-hover
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={film.image}
            alt={film.title}
            className="w-full h-full object-cover transition-transform duration-300"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
          />
          {/* Overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)',
              opacity: hovered ? 1 : 0.7,
            }}
          />

          {/* Tags */}
          <div className="absolute top-3 left-3 flex gap-2">
            {film.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-cinzel tracking-widest bg-red-600 text-white px-2 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Play button on hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: hovered ? 1 : 0 }}
          >
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 animate-pulse-glow">
              <Play size={20} className="text-white ml-1" fill="white" />
            </div>
          </motion.div>

          {/* Spotlight */}
          {hovered && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 50%, rgba(229,9,20,0.15) 0%, transparent 70%)' }}
            />
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bebas text-xl text-white tracking-widest leading-tight">{film.title}</h3>
            <div className="flex items-center gap-1 text-yellow-400 shrink-0 ml-2">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-semibold text-white/70">{film.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/40 text-xs mb-3">
            <span className="font-cinzel tracking-wider">{film.genre}</span>
            <span>•</span>
            <span>{film.year}</span>
            <Clock size={10} className="ml-1" />
            <span>{film.duration}</span>
          </div>

          <motion.p
            className="text-white/50 text-xs leading-relaxed"
            animate={{ opacity: hovered ? 1 : 0.7, height: hovered ? 'auto' : '2.5em' }}
            style={{ overflow: 'hidden' }}
          >
            {film.description}
          </motion.p>

          {/* Progress bar */}
          <div className="mt-3 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: hovered ? '65%' : '0%' }}
              transition={{ duration: 0.6 }}
            />
          </div>
          {hovered && <p className="text-white/20 text-[10px] mt-1 font-cinzel">65% watched</p>}
        </div>

        {/* Neon border on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ boxShadow: hovered ? '0 0 20px rgba(229,9,20,0.3), inset 0 0 20px rgba(229,9,20,0.05)' : '0 0 0px transparent' }}
        />
      </div>
    </motion.div>
  );
}
