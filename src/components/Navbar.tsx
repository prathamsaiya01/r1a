import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell } from 'lucide-react';

type NavbarProps = {
  currentPage: 'home' | 'loveNotes';
  onNavigate: (page: 'home' | 'loveNotes') => void;
};

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Home', action: 'home' as const },
    { label: 'Memories', action: 'home' as const },
    { label: 'Moments', action: 'home' as const },
    { label: 'Love Notes', action: 'loveNotes' as const },
    { label: 'Favorites', action: 'home' as const },
  ];

  return (
    <motion.nav
      className="fixed top-3 left-0 right-0 z-[9990] px-8 md:px-16 py-4 flex items-center justify-between transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.5 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-8">
        <span className="font-cinzel text-2xl font-black text-red-600 tracking-widest glow-red animate-flicker select-none">
          HER
        </span>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = currentPage === item.action;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.action)}
                data-hover
                className={`font-cinzel text-xs tracking-widest uppercase transition-colors duration-200 relative ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-red-600 group-hover:w-full transition-all duration-200" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <motion.button
          data-hover
          className="text-white/60 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Search size={18} />
        </motion.button>
        <motion.button
          data-hover
          className="text-white/60 hover:text-white transition-colors relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full" />
        </motion.button>
        <motion.button
          data-hover
          className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-white/20 hover:ring-red-600 transition-all"
          whileHover={{ scale: 1.05 }}
        >
            <img
              src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=64&h=64&fit=crop"
              alt="Profile"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
        </motion.button>
      </div>
    </motion.nav>
  );
}
