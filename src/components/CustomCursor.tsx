import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, [data-hover], input, textarea, select');
      setIsHovering(!!isInteractive);
    };

    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 8}px, ${pos.current.y - 8}px)`;
      }
      const lerp = 0.08;
      trailPos.current.x += (pos.current.x - trailPos.current.x) * lerp;
      trailPos.current.y += (pos.current.y - trailPos.current.y) * lerp;
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x - 20}px, ${trailPos.current.y - 20}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousemove', checkHover);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousemove', checkHover);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      {/* Trail */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[99998] will-change-transform"
        style={{
          border: `1px solid ${isHovering ? '#e50914' : 'rgba(229,9,20,0.4)'}`,
          borderRadius: '50%',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
          width: isHovering ? '48px' : '40px',
          height: isHovering ? '48px' : '40px',
          boxShadow: isHovering ? '0 0 20px rgba(229,9,20,0.5)' : '0 0 8px rgba(229,9,20,0.2)',
        }}
      />
      {/* Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform"
        style={{
          width: isClicking ? '4px' : isHovering ? '0' : '8px',
          height: isClicking ? '4px' : isHovering ? '0' : '8px',
          background: '#e50914',
          borderRadius: '50%',
          transition: 'width 0.1s, height 0.1s',
          boxShadow: '0 0 10px #e50914, 0 0 20px rgba(229,9,20,0.6)',
          marginLeft: isHovering ? '4px' : '0',
          marginTop: isHovering ? '4px' : '0',
        }}
      />
    </>
  );
}
