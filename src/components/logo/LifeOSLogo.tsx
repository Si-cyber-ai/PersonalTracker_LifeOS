import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

// ─── Simple layered noise for organic wind ────────────────────────────
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

function layeredNoise(x: number, seed: number): number {
  return (
    smoothNoise(x, seed) * 0.6 +
    smoothNoise(x * 2, seed + 10) * 0.25 +
    smoothNoise(x * 4, seed + 20) * 0.15
  );
}

// ─── Size configs ─────────────────────────────────────────────────────
const SIZE_MAP = {
  small: { fontSize: 24, leafH: 10, range: 4 },
  medium: { fontSize: 32, leafH: 14, range: 7 },
  large: { fontSize: 72, leafH: 28, range: 13 },
} as const;

type LogoSize = keyof typeof SIZE_MAP;

interface LifeOSLogoProps {
  size?: LogoSize;
  className?: string;
  onClick?: () => void;
}

const LifeOSLogo: React.FC<LifeOSLogoProps> = ({
  size = 'medium',
  className = '',
  onClick,
}) => {
  const cfg = SIZE_MAP[size];

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // ── Spring values ────────────────────────────────────────────────
  const leafX = useSpring(0, { stiffness: 80, damping: 25, mass: 0.8 });
  const leafY = useSpring(0, { stiffness: 70, damping: 25, mass: 0.8 });
  const leafRotation = useSpring(0, { stiffness: 60, damping: 28, mass: 1.0 });
  const leafScale = useSpring(1, { stiffness: 120, damping: 20 });

  const [hovered, setHovered] = useState(false);
  const timeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const gustCooldown = useRef(0);

  // ── Listen for nav-bar wind gusts ────────────────────────────────
  const handleNavWind = useCallback(
    (e: Event) => {
      if (prefersReducedMotion) return;
      const { strength } = (e as CustomEvent).detail;
      const nudgeX = strength * cfg.range * 1.8 * (0.5 + Math.random() * 0.5);
      const nudgeY = -strength * cfg.range * 0.4;
      leafX.set(leafX.get() + nudgeX);
      leafY.set(leafY.get() + nudgeY);
      leafRotation.set(leafRotation.get() + nudgeX * 0.6);
      leafScale.set(1 + strength * 0.1);
      setTimeout(() => leafScale.set(1), 300);
    },
    [prefersReducedMotion, cfg.range, leafX, leafY, leafRotation, leafScale],
  );

  useEffect(() => {
    window.addEventListener('navwind', handleNavWind);
    return () => window.removeEventListener('navwind', handleNavWind);
  }, [handleNavWind]);

  // ── Main animation loop ──────────────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion) return;

    let lastTs: number | null = null;

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      timeRef.current += dt;
      gustCooldown.current = Math.max(0, gustCooldown.current - dt);

      const t = timeRef.current;

      const windX = layeredNoise(t * 0.35, 0) * cfg.range;
      const windY = layeredNoise(t * 0.25, 50) * cfg.range * 0.3;

      let gustX = 0;
      let gustY = 0;
      if (gustCooldown.current <= 0 && Math.random() > 0.993) {
        gustX = (Math.random() - 0.5) * cfg.range * 2.2;
        gustY = -Math.random() * cfg.range * 0.5;
        gustCooldown.current = 3 + Math.random() * 5;
        leafScale.set(1.08);
        setTimeout(() => leafScale.set(1), 200);
      }

      if (hovered) {
        gustX += (Math.random() - 0.5) * cfg.range * 0.6;
        gustY -= Math.random() * cfg.range * 0.15;
      }

      const totalX = windX + gustX;
      const totalY = windY + gustY + cfg.range * 0.15;

      leafX.set(totalX);
      leafY.set(totalY);
      leafRotation.set(totalX * 0.7);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion, hovered, cfg.range, leafX, leafY, leafRotation, leafScale]);

  // Hover burst
  const handleMouseEnter = () => {
    setHovered(true);
    if (prefersReducedMotion) return;
    const burstX = (Math.random() - 0.5) * cfg.range * 3.5;
    const burstY = -Math.random() * cfg.range * 0.9;
    leafX.set(leafX.get() + burstX);
    leafY.set(leafY.get() + burstY);
    leafRotation.set(burstX * 0.9);
    leafScale.set(1.12);
    setTimeout(() => leafScale.set(1), 250);
  };

  // ── Leaf SVG ─────────────────────────────────────────────────────
  const leafW = cfg.leafH * 0.55;
  const svgW = leafW + 6;
  const svgH = cfg.leafH + 4;

  const LeafSVG = (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`leafGrad-${size}`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="hsl(140, 60%, 55%)" />
          <stop offset="100%" stopColor="hsl(140, 50%, 38%)" />
        </linearGradient>
      </defs>
      <path
        d={`
          M ${svgW / 2} 1
          C ${svgW * 0.82} ${svgH * 0.18},
            ${svgW * 0.92} ${svgH * 0.55},
            ${svgW / 2} ${svgH - 1.5}
          C ${svgW * 0.08} ${svgH * 0.55},
            ${svgW * 0.18} ${svgH * 0.18},
            ${svgW / 2} 1
          Z
        `}
        fill={`url(#leafGrad-${size})`}
        stroke="hsl(140, 45%, 34%)"
        strokeWidth={0.4}
      />
      <line
        x1={svgW / 2} y1={svgH * 0.12}
        x2={svgW / 2} y2={svgH - 2}
        stroke="hsla(140, 40%, 30%, 0.35)"
        strokeWidth={0.5} strokeLinecap="round"
      />
      {cfg.leafH >= 12 && (
        <>
          <line x1={svgW / 2} y1={svgH * 0.35} x2={svgW * 0.75} y2={svgH * 0.25}
            stroke="hsla(140, 40%, 30%, 0.22)" strokeWidth={0.35} strokeLinecap="round" />
          <line x1={svgW / 2} y1={svgH * 0.35} x2={svgW * 0.25} y2={svgH * 0.25}
            stroke="hsla(140, 40%, 30%, 0.22)" strokeWidth={0.35} strokeLinecap="round" />
          <line x1={svgW / 2} y1={svgH * 0.55} x2={svgW * 0.78} y2={svgH * 0.45}
            stroke="hsla(140, 40%, 30%, 0.18)" strokeWidth={0.3} strokeLinecap="round" />
          <line x1={svgW / 2} y1={svgH * 0.55} x2={svgW * 0.22} y2={svgH * 0.45}
            stroke="hsla(140, 40%, 30%, 0.18)" strokeWidth={0.3} strokeLinecap="round" />
        </>
      )}
    </svg>
  );

  // ── Layout constants ─────────────────────────────────────────────
  // The "i" is rendered as a dotless stem with the leaf floating above.
  // Gap between leaf bottom and stem top gives the "dot" separation.
  const stemTopClip = cfg.fontSize * 0.36; // clip to remove built-in dot
  const leafBottomY = -cfg.leafH * 0.15;   // leaf sits above stem with gap

  return (
    <span
      className={`inline-flex items-baseline select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      aria-label="LifeOS"
      style={{ lineHeight: 1 }}
    >
      {/* L */}
      <span className="font-display font-bold text-foreground" style={{ fontSize: cfg.fontSize }}>
        L
      </span>

      {/* i — dotless stem + floating leaf */}
      <span
        className="relative inline-flex flex-col items-center"
        style={{
          width: cfg.fontSize * 0.34,
          height: cfg.fontSize,
          marginLeft: -cfg.fontSize * 0.01,
        }}
      >
        {/* Leaf (the dot replacement) — positioned with clear gap above stem */}
        {prefersReducedMotion ? (
          <span
            className="absolute"
            style={{
              top: leafBottomY,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {LeafSVG}
          </span>
        ) : (
          <motion.span
            className="absolute"
            style={{
              top: leafBottomY,
              left: '50%',
              x: leafX,
              y: leafY,
              rotate: leafRotation,
              scale: leafScale,
              translateX: '-50%',
              willChange: 'transform',
            }}
          >
            {LeafSVG}
          </motion.span>
        )}

        {/* i stem (dot clipped away) */}
        <span
          className="font-display font-bold text-foreground"
          style={{
            fontSize: cfg.fontSize,
            lineHeight: 1,
            clipPath: `inset(${stemTopClip}px 0 0 0)`,
          }}
        >
          i
        </span>
      </span>

      {/* feOS */}
      <span
        className="font-display font-bold text-foreground"
        style={{ fontSize: cfg.fontSize, marginLeft: -cfg.fontSize * 0.01 }}
      >
        feOS
      </span>
    </span>
  );
};

export default LifeOSLogo;
