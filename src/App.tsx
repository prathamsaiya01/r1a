import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from './hooks/useLenis';

import CustomCursor from './components/CustomCursor';
import ParticleField from './components/ParticleField';
import ScrollProgress from './components/ScrollProgress';
import AudioToggle from './components/AudioToggle';
import NetflixIntro from './components/NetflixIntro';
import ProfileSelector from './components/ProfileSelector';
import PasscodeGate from './components/PasscodeGate';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ShowcaseSection from './components/ShowcaseSection';
import GallerySection from './components/GallerySection';
import CreditsSection from './components/CreditsSection';
import TimelineSection from './components/TimelineSection';
import LoveNotesPage from './components/LoveNotesPage';
import BirthdayPage from './components/BirthdayPage';
import USPage from './components/USPage';
import AdminPanel from './components/AdminPanel';

import { galleryImages, profiles } from './data/content';

type Stage = 'intro' | 'profile' | 'main';
type Page = 'home' | 'loveNotes' | 'birthday' | 'us';

type GalleryItem = {
  id: number;
  src: string;
  label: string;
  type: 'image' | 'video';
  custom?: boolean;
  temporary?: boolean;
};

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [stage, setStage] = useState<Stage>('intro');
  const [page, setPage] = useState<Page>('home');

  const [selectedProfile, setSelectedProfile] =
    useState<typeof profiles[0] | null>(null);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('ria-gallery-items')
        : null;

    const baseItems = galleryImages.map((item) => ({
      ...item,
      type: 'image' as const,
    }));

    if (!saved) return baseItems;

    try {
      const parsed = JSON.parse(saved) as GalleryItem[];

      if (Array.isArray(parsed)) {
        return [...baseItems, ...parsed];
      }
    } catch {
      return baseItems;
    }

    return baseItems;
  });

  useLenis();

  useEffect(() => {
    const customItems = galleryItems.filter(
      (item) => item.custom && !item.temporary
    );

    window.localStorage.setItem(
      'ria-gallery-items',
      JSON.stringify(customItems)
    );
  }, [galleryItems]);

  const addGalleryItem = (item: GalleryItem) => {
    setGalleryItems((prev) => [...prev, item]);
  };

  const removeGalleryItem = (id: number) => {
    setGalleryItems((prev) => {
      const removed = prev.find((item) => item.id === id);

      if (removed?.temporary) {
        URL.revokeObjectURL(removed.src);
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  const handleIntroComplete = () => {
    setStage('profile');
  };

  const handleProfileSelect = (profile: typeof profiles[0]) => {
    console.log('Selected profile:', profile);

    setSelectedProfile(profile);
    setStage('main');

    if (profile.id === 2) {
      setPage('birthday');
    } else if (profile.id === 4) {
      setPage('us');
    } else {
      setPage('home');
    }
  };

  useEffect(() => {
    if (stage !== 'main') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [stage]);

  if (!unlocked) {
    return <PasscodeGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="film-grain bg-black min-h-screen">
      {/* Global overlays */}
      <CustomCursor />
      <ParticleField />
      <ScrollProgress />
      <AudioToggle />

      {/* Netflix Intro */}
      <NetflixIntro
        show={stage === 'intro'}
        onComplete={handleIntroComplete}
      />

      {/* Profile Selector */}
      <AnimatePresence>
        {stage === 'profile' && (
          <ProfileSelector onSelect={handleProfileSelect} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {stage === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            {/* Selected Profile Badge */}
            {selectedProfile && (
              <motion.div
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[9900] glass rounded-full px-6 py-2 flex items-center gap-3"
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <img
                  src={selectedProfile.avatar}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />

                <span className="font-cinzel text-xs tracking-widest text-white/60 uppercase">
                  Watching as{' '}
                  <span className="text-white">
                    {selectedProfile.name}
                  </span>
                </span>
              </motion.div>
            )}

            {/* Navbar */}
            <Navbar
              currentPage={page}
              onNavigate={(target) => setPage(target)}
            />

            {/* PAGE SWITCHING */}
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {page === 'home' && (
                <>
                  <HeroSection />
                  <ShowcaseSection />

                  <GallerySection items={galleryItems} />

                  <TimelineSection />

                  <CreditsSection />

                  <AdminPanel
                    items={galleryItems}
                    onAddItem={addGalleryItem}
                    onRemoveItem={removeGalleryItem}
                  />
                </>
              )}

              {page === 'loveNotes' && (
                <LoveNotesPage onBack={() => setPage('home')} />
              )}

              {page === 'birthday' && (
                <BirthdayPage onBack={() => setPage('home')} />
              )}

              {page === 'us' && (
                <USPage onBack={() => setPage('home')} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}