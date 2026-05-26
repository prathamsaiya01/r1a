import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Play, Info, ChevronDown, X } from 'lucide-react';
import { useMagneticButton } from '../hooks/useMagneticButton';

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const playBtnRef = useMagneticButton(0.3) as React.RefObject<HTMLButtonElement>;
  const infoBtnRef = useMagneticButton(0.3) as React.RefObject<HTMLButtonElement>;
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const videoSrc = '/hero-video.mp4';

  useEffect(() => {
    if (!titleRef.current) return;
    const letters = titleRef.current.querySelectorAll('.letter');
    gsap.fromTo(letters,
      { opacity: 0, y: 100, rotateX: -90 },
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.04, duration: 0.8, ease: 'back.out(1.5)', delay: 0.3 }
    );
  }, []);

  useEffect(() => {
    document.body.style.overflow = videoOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [videoOpen]);

  useEffect(() => {
    if (!videoOpen || !videoRef.current) return;
    const video = videoRef.current;
    video.muted = false;
    video.volume = 1;
    video.play().catch(() => {
      // Browser may block autoplay; controls are still available for user.
    });
  }, [videoOpen]);

  const openVideo = () => setVideoOpen(true);
  const closeVideo = () => {
    setVideoOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const titleChars = 'ETERNAL LOVE'.split('');

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      id="hero"
    >
      {/* Background image with parallax handled by GSAP in parent */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/1.jpeg"
          alt="Eternal Love cover"
          className="w-full h-full object-cover scale-110"
          decoding="async"
          style={{ filter: 'brightness(0.35) saturate(0.7)' }}
          id="hero-bg"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-64" style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }} />
        {/* Red vignette bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, rgba(229,9,20,0.08) 0%, transparent 100%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 max-w-4xl pt-24">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-red-500 font-bebas text-lg tracking-widest">♥</span>
          <span className="text-white/60 text-xs tracking-[0.4em] uppercase font-cinzel">Love Story</span>
        </motion.div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-bebas text-[72px] md:text-[120px] leading-none mb-6 perspective-[800px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {titleChars.map((ch, i) => (
            <span
              key={i}
              className="letter inline-block"
              style={{
                color: ch === ' ' ? 'transparent' : '#fff',
                textShadow: ch !== ' ' ? '0 0 40px rgba(229,9,20,0.3)' : 'none',
                marginRight: ch === ' ' ? '0.3em' : undefined,
              }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </h1>

        {/* Meta */}
        <motion.div
          className="flex items-center gap-4 mb-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-green-400 font-semibold">100% Perfect Match</span>
          <span className="text-white/50">Forever</span>
          <span className="border border-white/40 text-white/60 px-2 py-0.5 text-xs rounded">RATED U</span>
          <span className="text-white/50">Timeless</span>
          <span className="border border-white/20 text-white/40 px-1.5 py-0.5 text-[10px]">❤️</span>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-white/70 text-base md:text-lg leading-relaxed max-w-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          A journey through infinity for Ria, where your love is the only constellation I'll ever need to guide me home.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <button
            ref={playBtnRef}
            type="button"
            onClick={openVideo}
            data-hover
            className="magnetic-btn flex items-center gap-3 bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors text-base"
          >
            <Play size={20} fill="black" />
            Play
          </button>
          <button
            ref={infoBtnRef}
            type="button"
            data-hover
            className="magnetic-btn flex items-center gap-3 glass text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-base"
          >
            <Info size={20} />
            More Info
          </button>
        </motion.div>
      </div>

      {videoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <button
              type="button"
              onClick={closeVideo}
              className="absolute top-4 right-4 z-20 rounded-full bg-black/70 p-3 text-white hover:bg-black transition"
            >
              <X size={20} />
            </button>
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[80vh] bg-black"
              src={videoSrc}
              controls
              autoPlay
              playsInline
            >
              Your browser does not support video playback.
            </video>
            <div className="bg-black/80 px-6 py-4 text-sm text-white/80">
              Upload your video to <code className="text-white">public/hero-video.mp4</code> to replace this playback source.
            </div>
          </div>
        </div>
      )}

      {/* Right side floating elements */}
      <motion.div
        className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 z-10 hidden md:flex"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="glass rounded-lg px-4 py-2 text-xs font-cinzel tracking-widest text-red-400">MY FAVORITE</div>
        <div className="glass rounded-lg px-4 py-2 text-xs font-cinzel tracking-widest text-white/50">LOVE YOU ♥</div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}
