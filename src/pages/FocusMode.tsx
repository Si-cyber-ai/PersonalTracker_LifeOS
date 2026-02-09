import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { format } from 'date-fns';
import { X } from 'lucide-react';

const quotes = [
  "Deep work produces deep results.",
  "Focus is a superpower.",
  "One task at a time.",
  "Small consistent actions create remarkable results.",
  "The present moment is all you have.",
  "Clarity comes from engagement, not thought.",
];

const FocusMode = () => {
  const navigate = useNavigate();
  const { skyColors, isNight } = useTimeOfDay();
  const [time, setTime] = useState(new Date());
  const [showUI, setShowUI] = useState(true);
  const [mouseTimer, setMouseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
    };
    const handleMouse = () => {
      setShowUI(true);
      if (mouseTimer) clearTimeout(mouseTimer);
      const t = setTimeout(() => setShowUI(false), 3000);
      setMouseTimer(t);
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousemove', handleMouse);
    // Initial fade
    const initTimer = setTimeout(() => setShowUI(false), 4000);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousemove', handleMouse);
      if (mouseTimer) clearTimeout(mouseTimer);
      clearTimeout(initTimer);
    };
  }, [navigate, mouseTimer]);

  const hours = format(time, 'HH');
  const minutes = format(time, 'mm');
  const seconds = format(time, 'ss');

  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 60,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 4, duration: 2 + Math.random() * 3,
  }));

  const dailyQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden cursor-none" style={{ background: `linear-gradient(180deg, ${skyColors.top}, ${skyColors.middle} 50%, ${skyColors.bottom})` }}>
      {/* Stars at night */}
      {isNight && stars.map(star => (
        <div key={star.id} className="absolute rounded-full" style={{
          left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size,
          backgroundColor: 'white', animation: `twinkle ${star.duration}s ease-in-out infinite`, animationDelay: `${star.delay}s`,
        }} />
      ))}

      {/* Fireflies at night */}
      {isNight && Array.from({ length: 5 }, (_, i) => (
        <div key={`ff-${i}`} className="absolute w-2 h-2 rounded-full" style={{
          left: `${20 + i * 15}%`, top: `${40 + i * 8}%`,
          background: 'radial-gradient(circle, rgba(180,255,100,0.85), rgba(150,255,50,0) 70%)',
          boxShadow: '0 0 8px rgba(180,255,100,0.4)',
          animation: `firefly-float ${12 + i * 3}s ease-in-out infinite`,
          animationDelay: `${i * 2}s`,
        }} />
      ))}

      {/* Exit button */}
      <button
        onClick={() => navigate('/')}
        className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-500 ${showUI ? 'opacity-70 hover:opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', cursor: 'pointer' }}
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Flip Clock */}
      <div className="flex items-center gap-3 md:gap-5">
        <DigitPair value={hours} />
        <Separator />
        <DigitPair value={minutes} />
        <Separator />
        <DigitPair value={seconds} />
      </div>

      {/* Quote */}
      <p className={`absolute bottom-16 text-center text-sm md:text-base px-8 max-w-lg transition-opacity duration-500 font-accent italic ${showUI ? 'opacity-50' : 'opacity-0'}`} style={{ color: 'rgba(255,255,255,0.7)' }}>
        "{dailyQuote}"
      </p>

      {/* Hint */}
      <p className={`absolute bottom-8 text-xs transition-opacity duration-500 ${showUI ? 'opacity-30' : 'opacity-0'}`} style={{ color: 'rgba(255,255,255,0.5)' }}>
        Press ESC to exit focus mode
      </p>
    </div>
  );
};

const DigitPair = ({ value }: { value: string }) => (
  <div className="flex gap-1 md:gap-1.5">
    {value.split('').map((digit, i) => (
      <div key={i} className="relative flex items-center justify-center overflow-hidden rounded-xl md:rounded-2xl"
        style={{
          width: 'clamp(40px, 10vw, 80px)', height: 'clamp(56px, 14vw, 112px)',
          background: 'rgba(10, 15, 30, 0.75)', backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
        <span className="font-mono font-bold text-white" style={{ fontSize: 'clamp(28px, 7vw, 56px)' }}>{digit}</span>
        <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: 'rgba(0,0,0,0.3)' }} />
        <div className="absolute inset-x-0 top-[calc(50%+1px)] h-px" style={{ background: 'rgba(255,255,255,0.03)' }} />
      </div>
    ))}
  </div>
);

const Separator = () => (
  <div className="flex flex-col gap-2 md:gap-3">
    <div className="rounded-full" style={{ width: 'clamp(6px, 1.2vw, 10px)', height: 'clamp(6px, 1.2vw, 10px)', backgroundColor: 'rgba(255,255,255,0.5)', animation: 'clock-blink 2s ease-in-out infinite' }} />
    <div className="rounded-full" style={{ width: 'clamp(6px, 1.2vw, 10px)', height: 'clamp(6px, 1.2vw, 10px)', backgroundColor: 'rgba(255,255,255,0.5)', animation: 'clock-blink 2s ease-in-out infinite' }} />
  </div>
);

export default FocusMode;
