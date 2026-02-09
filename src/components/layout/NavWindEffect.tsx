import { useEffect, useRef, useMemo, useState } from 'react';

// ─── Noise helper ─────────────────────────────────────────────────────
function hash(n: number): number {
  const s = Math.sin(n) * 43758.5453123;
  return s - Math.floor(s);
}
function smoothNoise(x: number, seed: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const t = f * f * f * (f * (f * 6 - 15) + 10);
  const a = hash(i + seed * 127.1) * 2 - 1;
  const b = hash(i + 1 + seed * 127.1) * 2 - 1;
  return a + (b - a) * t;
}

// ─── Particle ─────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
}

function createParticle(id: number, maxH: number): Particle {
  return {
    id,
    x: Math.random() * -15,
    y: 6 + Math.random() * Math.max(maxH - 12, 32),
    size: 1.5 + Math.random() * 2,
    opacity: 0,
    speed: 0.2 + Math.random() * 0.35,
    drift: (Math.random() - 0.5) * 0.06,
  };
}

// ─── Component ────────────────────────────────────────────────────────
const NavWindEffect = () => {
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const gustRef = useRef({ active: false, progress: 0, cooldown: 2, strength: 0 });

  // Gradient sweep (CSS-driven)
  const [sweepX, setSweepX] = useState(-30);
  const [sweepOpacity, setSweepOpacity] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        w = rect.width;
        h = rect.height;
        canvas.width = w * window.devicePixelRatio;
        canvas.height = h * window.devicePixelRatio;
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      }
    };
    resize();

    // Init particles — more of them, spread across bar
    particlesRef.current = Array.from({ length: 14 }, (_, i) => {
      const p = createParticle(i, h);
      p.x = Math.random() * 100; // spread initially
      return p;
    });

    window.addEventListener('resize', resize);

    let lastTs: number | null = null;

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      timeRef.current += dt;
      const t = timeRef.current;
      const gust = gustRef.current;

      // ── Gust scheduling — much more frequent ───────────────────
      gust.cooldown = Math.max(0, gust.cooldown - dt);

      if (!gust.active && gust.cooldown <= 0) {
        gust.active = true;
        gust.progress = 0;
        gust.strength = 0.5 + Math.random() * 0.5;
        gust.cooldown = 4 + Math.random() * 8; // 4-12s between gusts

        window.dispatchEvent(
          new CustomEvent('navwind', { detail: { strength: gust.strength } }),
        );
      }

      // ── Gust animation ─────────────────────────────────────────
      let gustMultiplier = 0;
      if (gust.active) {
        const duration = 8 + gust.strength * 6; // 8-14s sweep
        gust.progress += dt / duration;

        if (gust.progress >= 1) {
          gust.active = false;
          gust.progress = 0;
        } else {
          gustMultiplier = Math.sin(gust.progress * Math.PI) * gust.strength;
        }

        setSweepX(gust.progress * 140 - 40);
        setSweepOpacity(gustMultiplier * 0.22); // more visible
      } else {
        setSweepOpacity((prev) => prev > 0.005 ? prev * 0.93 : 0);
      }

      // ── Draw particles ─────────────────────────────────────────
      if (!w || !h) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Constant gentle baseline wind
      const baseWind = smoothNoise(t * 0.12, 0) * 0.04 + 0.06;

      particlesRef.current.forEach((p) => {
        const windSpeed = baseWind + gustMultiplier * 0.5 * p.speed;

        p.x += windSpeed * 100 * dt;
        p.y += p.drift * h * dt + smoothNoise(t * 0.25 + p.id * 7.3, 30) * 0.2;

        // Opacity — visible even without gusts, brighter during gusts
        const edgeFade = Math.min(p.x / 12, 1) * Math.min((108 - p.x) / 12, 1);
        const targetOpacity =
          Math.max(0, edgeFade) *
          (0.18 + gustMultiplier * 0.35) *
          (0.6 + p.size / 3.5);

        p.opacity += (targetOpacity - p.opacity) * 0.08;

        // Recycle
        if (p.x > 108) {
          p.x = -3 - Math.random() * 8;
          p.y = 6 + Math.random() * Math.max(h - 12, 32);
          p.opacity = 0;
        }

        p.y = Math.max(3, Math.min(h - 3, p.y));

        const px = (p.x / 100) * w;
        const py = p.y;

        // Main dot
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(168, 35%, 88%, ${p.opacity})`;
        ctx.fill();

        // Soft glow halo
        if (p.opacity > 0.05) {
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(168, 30%, 92%, ${p.opacity * 0.25})`;
          ctx.fill();
        }

        // Streak trail during gusts
        if (gustMultiplier > 0.15 && p.opacity > 0.08) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - gustMultiplier * 18 * p.speed, py + p.drift * 3);
          ctx.strokeStyle = `hsla(168, 30%, 90%, ${p.opacity * 0.3 * gustMultiplier})`;
          ctx.lineWidth = p.size * 0.6;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Gradient light sweep — soft moving highlight */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 30% 120% at ${sweepX}% 50%, hsla(168, 45%, 92%, ${sweepOpacity}), transparent 70%)`,
          willChange: 'background',
          transition: 'none',
        }}
      />

      {/* Second softer, wider sweep for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 100% at ${sweepX + 15}% 60%, hsla(180, 30%, 96%, ${sweepOpacity * 0.5}), transparent 60%)`,
          willChange: 'background',
          transition: 'none',
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

export default NavWindEffect;
