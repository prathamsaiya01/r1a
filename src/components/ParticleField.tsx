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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const particles: Particle[] = [];
    const streaks: { x: number; y: number; len: number; speed: number; alpha: number; angle: number }[] = [];

    for (let i = 0; i < 80; i++) {
      particles.push(createParticle(W, H));
    }

    for (let i = 0; i < 12; i++) {
      streaks.push({
        x: Math.random() * W,
        y: Math.random() * H,
        len: 80 + Math.random() * 200,
        speed: 1 + Math.random() * 3,
        alpha: 0.1 + Math.random() * 0.3,
        angle: -0.2 + Math.random() * 0.1,
      });
    }

    function createParticle(w: number, h: number): Particle {
      const maxLife = 100 + Math.random() * 200;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.1 - Math.random() * 0.4,
        alpha: 0,
        size: 0.5 + Math.random() * 2,
        life: 0,
        maxLife,
      };
    }

    let rafId: number;

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Streaks
      streaks.forEach((s) => {
        const grad = ctx!.createLinearGradient(s.x, s.y, s.x + Math.cos(s.angle) * s.len, s.y + Math.sin(s.angle) * s.len);
        grad.addColorStop(0, `rgba(229,9,20,0)`);
        grad.addColorStop(0.5, `rgba(229,9,20,${s.alpha})`);
        grad.addColorStop(1, `rgba(229,9,20,0)`);
        ctx!.beginPath();
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1;
        ctx!.moveTo(s.x, s.y);
        ctx!.lineTo(s.x + Math.cos(s.angle) * s.len, s.y + Math.sin(s.angle) * s.len);
        ctx!.stroke();
        s.x -= s.speed * 0.3;
        s.y -= s.speed;
        if (s.y + s.len < 0) {
          s.x = Math.random() * W;
          s.y = H + 50;
        }
      });

      // Particles
      particles.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const progress = p.life / p.maxLife;
        p.alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
        p.alpha *= 0.6;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(229,9,20,${p.alpha})`;
        ctx!.fill();

        if (p.life >= p.maxLife) {
          particles[i] = createParticle(W, H);
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
      style={{ opacity: 0.8 }}
    />
  );
}
