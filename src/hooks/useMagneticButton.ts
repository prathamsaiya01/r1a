import { useRef, useEffect } from 'react';

export function useMagneticButton(strength = 0.4) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;
    if (!el || isTouchDevice) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;

    const updateTransform = () => {
      if (el) {
        el.style.transform = `translate(${targetX}px, ${targetY}px)`;
      }
      rafId = requestAnimationFrame(updateTransform);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientX - cx) * strength;
      targetY = (e.clientY - cy) * strength;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(updateTransform);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (el) {
        el.style.transform = '';
      }
    };
  }, [strength]);

  return ref;
}
