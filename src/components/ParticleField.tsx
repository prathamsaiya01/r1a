import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  life: number;
  maxLife: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!pointerFine || prefersReducedMotion) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const particles: Particle[] = [];
    const streaks: { x: number; y: number; len: number; speed: number; alpha: number; angle: number }[] = [];

    for (let i = 0; i < 35; i++) {
      particles.push(createParticle(W, H));
    }

    for (let i = 0; i < 6; i++) {
      streaks.push({
        x: Math.random() * W,
        y: Math.random() * H,
        len: 100 + Math.random() * 120,
        speed: 0.8 + Math.random() * 1.5,
        alpha: 0.08 + Math.random() * 0.2,
        angle: -0.15 + Math.random() * 0.08,
      });
    }

    function createParticle(w: number, h: number): Particle {
      const maxLife = 120 + Math.random() * 180;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.1 - Math.random() * 0.25,
        alpha: 0,
        size: 0.5 + Math.random() * 1.6,
        life: 0,
        maxLife,
      };
    }

    const context = ctx;
    let rafId: number;

    function draw() {
      context.clearRect(0, 0, W, H);

      streaks.forEach((s) => {
        const x2 = s.x + Math.cos(s.angle) * s.len;
        const y2 = s.y + Math.sin(s.angle) * s.len;
        const grad = context.createLinearGradient(s.x, s.y, x2, y2);
        grad.addColorStop(0, 'rgba(229,9,20,0)');
        grad.addColorStop(0.5, `rgba(229,9,20,${s.alpha})`);
        grad.addColorStop(1, 'rgba(229,9,20,0)');
        context.beginPath();
        context.strokeStyle = grad;
        context.lineWidth = 1;
        context.moveTo(s.x, s.y);
        context.lineTo(x2, y2);
        context.stroke();

        s.x -= s.speed * 0.3;
        s.y -= s.speed;
        if (s.y + s.len < 0) {
          s.x = Math.random() * W;
          s.y = H + 50;
        }
      });

      particles.forEach((p, index) => {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        const progress = p.life / p.maxLife;
        p.alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
        p.alpha *= 0.55;

        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(229,9,20,${p.alpha})`;
        context.fill();

        if (p.life >= p.maxLife) {
          particles[index] = createParticle(W, H);
        }
      });

      rafId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.75 }}
    />
  );
}
