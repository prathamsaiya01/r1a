import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';

type Piece = {
  id: number;
  row: number;
  col: number;
  x: number;
  y: number;
  rotation: number;
  placed: boolean;
  zIndex: number;
  targetX: number;
  targetY: number;
};

const ROWS = 6;
const COLS = 6;
const PIECE_COUNT = ROWS * COLS;
const IMAGE_URL = '/images/2.jpeg';

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const distance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.hypot(x2 - x1, y2 - y1);

const createPieces = (
  boardLeft: number,
  boardTop: number,
  boardWidth: number,
  boardHeight: number
): Piece[] => {
  const pieceWidth = boardWidth / COLS;
  const pieceHeight = boardHeight / ROWS;
  const spread = Math.min(boardWidth, boardHeight) * 0.9;

  return Array.from({ length: PIECE_COUNT }, (_, index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    const targetX = boardLeft + col * pieceWidth;
    const targetY = boardTop + row * pieceHeight;
    const angle = randomBetween(0, Math.PI * 2);
    const radius = randomBetween(Math.min(pieceWidth, pieceHeight) * 1.3, spread * 0.75);

    return {
      id: index,
      row,
      col,
      x: targetX + Math.cos(angle) * radius,
      y: targetY + Math.sin(angle) * radius,
      rotation: randomBetween(-16, 16),
      placed: false,
      zIndex: PIECE_COUNT - index,
      targetX,
      targetY,
    };
  });
};

const buildParticleSet = (count: number, scale = 1) =>
  Array.from({ length: count }, () => ({
    left: randomBetween(3, 97),
    top: randomBetween(5, 75),
    delay: randomBetween(0, 6),
    duration: randomBetween(8, 14) * scale,
    size: randomBetween(4, 10) * scale,
  }));

export default function JigsawPuzzle() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const [imageRatio, setImageRatio] = useState(1);
  const [layout, setLayout] = useState({
    boardLeft: 0,
    boardTop: 160,
    boardWidth: 560,
    boardHeight: 560,
    wrapperHeight: 760,
  });
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [completed, setCompleted] = useState(false);
  const [activePiece, setActivePiece] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);
  const dragState = useRef<{
    id: number;
    offsetX: number;
    offsetY: number;
    pointerId: number;
  } | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const progressText = useMemo(
    () => `${progress}% Completed`,
    [progress]
  );

  useEffect(() => {
    const img = new Image();
    img.src = IMAGE_URL;
    img.onload = () => {
      setImageRatio(img.width / img.height || 1);
    };
  }, []);

  useLayoutEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const updateLayout = () => {
      const width = node.clientWidth;
      const boardWidth = Math.min(760, width * 0.88);
      const boardHeight = Math.max(360, boardWidth / imageRatio);
      setLayout({
        boardLeft: (width - boardWidth) / 2,
        boardTop: 160,
        boardWidth,
        boardHeight,
        wrapperHeight: Math.max(780, boardHeight + 220),
      });
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(node);
    return () => observer.disconnect();
  }, [imageRatio]);

  useEffect(() => {
    if (layout.boardWidth <= 0 || layout.boardHeight <= 0 || pieces.length > 0) return;
    setPieces(createPieces(layout.boardLeft, layout.boardTop, layout.boardWidth, layout.boardHeight));
  }, [layout, pieces.length]);

  useEffect(() => {
    const placedCount = pieces.filter((piece) => piece.placed).length;
    const nextProgress = Math.round((placedCount / PIECE_COUNT) * 100);
    setProgress(nextProgress);
    if (placedCount === PIECE_COUNT) {
      setCompleted(true);
    }
  }, [pieces]);

  useEffect(() => {
    if (!completed || !sweepRef.current) return;

    const tl = gsap.timeline();
    tl.to(sweepRef.current, {
      x: '120%',
      opacity: 0.35,
      duration: 1.6,
      ease: 'power2.out',
    });
    tl.to(
      sweepRef.current,
      {
        opacity: 0,
        duration: 0.8,
        ease: 'power1.out',
      },
      '>-0.6'
    );
  }, [completed]);

  useEffect(() => {
    if (!completed || musicStarted) return;

    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    master.gain.value = 0.001;
    master.connect(ctx.destination);

    [110, 165, 220].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = index % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.value = frequency;
      gain.gain.value = 0.024;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
    });

    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 4);

    audioRef.current = ctx;
    setMusicStarted(true);
  }, [completed, musicStarted]);

  const resetPuzzle = () => {
    setCompleted(false);
    setMusicStarted(false);
    if (audioRef.current) {
      audioRef.current.close().catch(() => undefined);
      audioRef.current = null;
    }
    setPieces(createPieces(layout.boardLeft, layout.boardTop, layout.boardWidth, layout.boardHeight));
  };

  const updatePiecePosition = (id: number, x: number, y: number) => {
    setPieces((current) =>
      current.map((piece) =>
        piece.id === id && !piece.placed
          ? {
              ...piece,
              x,
              y,
            }
          : piece
      )
    );
  };

  const placePiece = (id: number) => {
    setPieces((current) =>
      current.map((piece) => {
        if (piece.id !== id || piece.placed) return piece;

        return {
          ...piece,
          x: piece.targetX,
          y: piece.targetY,
          rotation: 0,
          placed: true,
          zIndex: 999,
        };
      })
    );
  };

  const handlePointerDown = (
    pieceId: number,
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    const piece = pieces.find((item) => item.id === pieceId);
    if (!piece || piece.placed) return;

    const button = event.currentTarget;
    button.setPointerCapture(event.pointerId);
    dragState.current = {
      id: pieceId,
      offsetX: event.clientX - piece.x,
      offsetY: event.clientY - piece.y,
      pointerId: event.pointerId,
    };
    setActivePiece(pieceId);
    setPieces((current) =>
      current.map((item) =>
        item.id === pieceId ? { ...item, zIndex: PIECE_COUNT + 1 } : item
      )
    );
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    updatePiecePosition(drag.id, event.clientX - drag.offsetX, event.clientY - drag.offsetY);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const piece = pieces.find((item) => item.id === drag.id);
    if (piece) {
      const distanceToTarget = distance(piece.x, piece.y, piece.targetX, piece.targetY);
      if (distanceToTarget < Math.min(layout.boardWidth, layout.boardHeight) * 0.14) {
        placePiece(drag.id);
      }
    }

    dragState.current = null;
    setActivePiece(null);
  };

  const heartParticles = useMemo(() => buildParticleSet(14, 1), []);
  const sparkParticles = useMemo(() => buildParticleSet(20, 0.7), []);

  return (
    <section
      ref={wrapperRef}
      className="relative overflow-hidden text-white"
      style={{ minHeight: layout.wrapperHeight }}
    >
      <div className="absolute inset-0 puzzle-hero-bg" />
      {heartParticles.map((particle, index) => (
        <span
          key={`heart-${index}`}
          className="puzzle-heart"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            fontSize: `${particle.size}px`,
          }}
        >
          ❤️
        </span>
      ))}
      {sparkParticles.map((particle, index) => (
        <span
          key={`spark-${index}`}
          className="puzzle-spark"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,220,180,0.14),transparent_18%),radial-gradient(circle_at_80%_15%,rgba(255,140,90,0.16),transparent_18%),linear-gradient(180deg,rgba(0,0,0,0.0),rgba(0,0,0,0.75))] pointer-events-none" />

      <motion.div
        className="relative mx-auto max-w-[1280px] px-6 py-10"
        animate={{ scale: completed ? 1.02 : 1 + progress * 0.0009 }}
        transition={{ type: 'spring', stiffness: 160, damping: 26 }}
      >
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200/70 mb-4">
            Cinematic Puzzle Experience
          </p>
          <h2 className="font-bebas text-4xl md:text-5xl text-white tracking-tight">
            Restore our love story, piece by piece.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            A premium romantic jigsaw built with subtle lighting, floating golden particles, and a cinematic reveal as the final photograph comes together.
          </p>
        </div>

        <div className="puzzle-progress mt-10">
          <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.35em] text-amber-100/70 mb-3">
            <span>Progress</span>
            <span>{progressText}</span>
          </div>
          <div className="puzzle-progress-bar">
            <motion.div
              className="puzzle-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-[900px]">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#ca7c4f]/15 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b050b]/90 to-transparent pointer-events-none" />
          <div
            className="relative mx-auto rounded-[40px] border border-white/10 bg-black/30 shadow-[0_30px_160px_rgba(0,0,0,0.45)]"
            style={{ minHeight: layout.boardHeight + 80 }}
          >
            <div className="absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_center,rgba(255,232,176,0.08),transparent_28%)] pointer-events-none" />
            <div ref={sweepRef} className="puzzle-sweep" />

            <AnimatePresence>
              {completed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="puzzle-completion"
                >
                  <div>
                    <h1>Every piece of my life made sense when I found you.</h1>
                    <p>
                      The final image is restored in a warm golden glow, and the whole scene blooms with romantic light.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="absolute"
              style={{
                left: layout.boardLeft,
                top: layout.boardTop,
                width: layout.boardWidth,
                height: layout.boardHeight,
                pointerEvents: 'none',
              }}
            >
              <div className="absolute inset-0 rounded-[34px] border border-white/8 bg-black/20 backdrop-blur-xl" />
              <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_45%)] pointer-events-none" />
            </div>

            {pieces.map((piece) => {
              const pieceWidth = layout.boardWidth / COLS;
            const pieceHeight = layout.boardHeight / ROWS;
            const bgSize = `${layout.boardWidth}px ${layout.boardHeight}px`;
            const bgPosition = `-${piece.col * pieceWidth}px -${piece.row * pieceHeight}px`;

            return (
              <motion.button
                key={piece.id}
                id={`puzzle-piece-${piece.id}`}
                type="button"
                onPointerDown={(event) => handlePointerDown(piece.id, event)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`puzzle-piece ${piece.placed ? 'placed' : ''}`}
                style={{
                  width: pieceWidth,
                  height: pieceHeight,
                  x: piece.x,
                  y: piece.y,
                  zIndex: piece.zIndex,
                  backgroundImage: `url(${IMAGE_URL})`,
                  backgroundSize: bgSize,
                  backgroundPosition: bgPosition,
                  filter: piece.placed
                    ? 'saturate(1.25) drop-shadow(0 14px 32px rgba(255,190,110,0.18))'
                    : 'drop-shadow(0 24px 60px rgba(0,0,0,0.38))',
                }}
                animate={{
                  scale: piece.placed ? 1.04 : activePiece === piece.id ? 1.02 : 1,
                  rotate: piece.rotation,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              >
                  <span className="puzzle-piece-glow" />
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.35em] text-amber-100/70">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Cinematic depth</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Magnetic snap</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Storybook reveal</span>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={resetPuzzle}
            className="rounded-full border border-amber-300/20 bg-amber-400/10 px-7 py-3 text-sm uppercase tracking-[0.25em] text-amber-100 transition hover:border-amber-300/40 hover:bg-amber-400/15"
          >
            Reset Puzzle
          </button>
        </div>
      </motion.div>
    </section>
  );
}
