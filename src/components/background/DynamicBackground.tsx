import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';

const DynamicBackground = () => {
  const { period, skyColors, sunPosition, isNight } = useTimeOfDay();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [sunClicked, setSunClicked] = useState(false);
  const isEvening = period === 'evening';

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const stars = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 55,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    })), []
  );

  const clouds = useMemo(() => [
    { id: 1, top: 12, speed: 50, scale: 1.3, opacity: 0.8 },
    { id: 2, top: 22, speed: 65, scale: 0.85, opacity: 0.6 },
    { id: 3, top: 8, speed: 58, scale: 1.05, opacity: 0.7 },
    { id: 4, top: 28, speed: 75, scale: 0.65, opacity: 0.5 },
  ], []);

  const creatures = useMemo(() =>
    Array.from({ length: isNight ? 7 : 3 }, (_, i) => ({
      id: i,
      startX: Math.random() * 80 + 10,
      startY: 20 + Math.random() * 35,
      delay: i * 4 + Math.random() * 5,
      duration: 12 + Math.random() * 10,
    })), [isNight]
  );

  const handleSunClick = () => {
    setSunClicked(true);
    setTimeout(() => setSunClicked(false), 600);
  };

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ zIndex: 0 }}>
      {/* Sky gradient */}
      <div
        className="absolute inset-0 transition-all duration-[20000ms] ease-linear"
        style={{
          background: `linear-gradient(180deg, ${skyColors.top} 0%, ${skyColors.middle} 50%, ${skyColors.bottom} 100%)`,
        }}
      />

      {/* Stars (night + evening) */}
      {(isNight || isEvening) && stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            backgroundColor: 'white',
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            opacity: isNight ? 0.9 : 0.3,
            transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px)`,
          }}
        />
      ))}

      {/* Sun or Moon */}
      <div
        className="absolute cursor-pointer transition-all duration-500 pointer-events-auto"
        style={{
          left: `${sunPosition.x}%`,
          top: `${sunPosition.y}%`,
          transform: `translate(-50%, -50%) translate(${mousePos.x * -6}px, ${mousePos.y * -4}px) scale(${sunClicked ? 1.25 : 1})`,
          zIndex: 2,
        }}
        onClick={handleSunClick}
      >
        {isNight ? (
          <div className="relative">
            <div
              className="w-14 h-14 rounded-full"
              style={{
                background: 'linear-gradient(135deg, hsl(210,20%,92%), hsl(220,15%,78%))',
                boxShadow: `0 0 ${sunClicked ? 60 : 35}px rgba(200,210,255,${sunClicked ? 0.6 : 0.35})`,
                transition: 'box-shadow 0.3s ease',
              }}
            />
            <div className="absolute top-2.5 left-3 w-3 h-3 rounded-full" style={{ background: 'rgba(180,190,210,0.35)' }} />
            <div className="absolute top-6 left-7 w-2 h-2 rounded-full" style={{ background: 'rgba(180,190,210,0.25)' }} />
          </div>
        ) : (
          <div
            className="w-16 h-16 rounded-full"
            style={{
              background: isEvening
                ? 'linear-gradient(135deg, hsl(35,90%,65%), hsl(15,85%,55%))'
                : 'linear-gradient(135deg, hsl(48,95%,78%), hsl(42,90%,62%))',
              boxShadow: `0 0 ${sunClicked ? 80 : 50}px ${isEvening ? 'rgba(255,140,50,0.5)' : 'rgba(255,220,80,0.45)'}`,
              animation: 'sun-pulse 4s ease-in-out infinite',
              transition: 'box-shadow 0.3s ease',
            }}
          />
        )}
      </div>

      {/* Clouds */}
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          className="absolute pointer-events-none"
          style={{
            top: `${cloud.top}%`,
            transform: `translate(${mousePos.x * -7 * cloud.scale}px, ${mousePos.y * -3}px)`,
            animation: `drift ${cloud.speed}s linear infinite`,
            animationDelay: `${-cloud.speed * (cloud.id * 0.25)}s`,
            opacity: isNight ? cloud.opacity * 0.2 : cloud.opacity,
            transition: 'opacity 20s ease',
          }}
        >
          <svg width={130 * cloud.scale} height={55 * cloud.scale} viewBox="0 0 130 55">
            <ellipse cx="65" cy="38" rx="55" ry="16" fill={isNight ? 'rgba(80,100,150,0.25)' : 'rgba(255,255,255,0.85)'} />
            <ellipse cx="48" cy="26" rx="32" ry="20" fill={isNight ? 'rgba(80,100,150,0.2)' : 'rgba(255,255,255,0.9)'} />
            <ellipse cx="82" cy="30" rx="28" ry="16" fill={isNight ? 'rgba(80,100,150,0.22)' : 'rgba(255,255,255,0.88)'} />
          </svg>
        </div>
      ))}

      {/* Far mountains */}
      <div className="absolute bottom-0 left-0 right-0" style={{ transform: `translateX(${mousePos.x * -8}px)` }}>
        <svg viewBox="0 0 1440 180" className="w-full block" preserveAspectRatio="none" style={{ minWidth: '110%', marginLeft: '-5%' }}>
          <path
            d="M0 180 L0 110 Q180 55 360 90 Q540 35 720 75 Q900 25 1080 85 Q1260 50 1440 95 L1440 180Z"
            fill={isNight ? 'hsl(230, 28%, 10%)' : isEvening ? 'hsl(255, 22%, 22%)' : 'hsl(155, 28%, 32%)'}
            className="transition-[fill] duration-[20000ms]"
          />
        </svg>
      </div>

      {/* Near mountains */}
      <div className="absolute bottom-0 left-0 right-0" style={{ transform: `translateX(${mousePos.x * -14}px)` }}>
        <svg viewBox="0 0 1440 130" className="w-full block" preserveAspectRatio="none" style={{ minWidth: '115%', marginLeft: '-7%' }}>
          <path
            d="M0 130 L0 85 Q250 45 450 70 Q650 25 850 60 Q1050 35 1250 55 L1440 75 L1440 130Z"
            fill={isNight ? 'hsl(230, 22%, 6%)' : isEvening ? 'hsl(255, 18%, 15%)' : 'hsl(155, 32%, 24%)'}
            className="transition-[fill] duration-[20000ms]"
          />
        </svg>
      </div>

      {/* Birds (day) / Fireflies (night) */}
      {creatures.map(c =>
        isNight ? (
          <div
            key={c.id}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              left: `${c.startX}%`,
              top: `${c.startY}%`,
              background: 'radial-gradient(circle, rgba(180,255,100,0.85), rgba(150,255,50,0) 70%)',
              boxShadow: '0 0 6px rgba(180,255,100,0.5)',
              animation: `firefly-float ${c.duration}s ease-in-out infinite`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ) : (
          <div
            key={c.id}
            className="absolute pointer-events-none"
            style={{
              left: '0%',
              top: `${c.startY}%`,
              animation: `bird-fly ${c.duration}s linear infinite`,
              animationDelay: `${c.delay}s`,
            }}
          >
            <svg width="18" height="10" viewBox="0 0 18 10" style={{ animation: 'wing-flap 0.4s ease-in-out infinite' }}>
              <path d="M9 5 Q4.5 0 0 2 Q4.5 3.5 9 5 Q13.5 3.5 18 2 Q13.5 0 9 5" fill="hsl(220, 18%, 28%)" opacity="0.65" />
            </svg>
          </div>
        )
      )}

      {/* Leaves (occasional) */}
      {!isNight && (
        <>
          {[0, 1, 2].map(i => (
            <div
              key={`leaf-${i}`}
              className="absolute pointer-events-none"
              style={{
                left: `${20 + i * 30}%`,
                top: '-20px',
                animation: `leaf-fall ${18 + i * 5}s linear infinite`,
                animationDelay: `${i * 8}s`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <ellipse cx="7" cy="7" rx="4" ry="7" fill={period === 'morning' ? 'hsl(130, 50%, 55%)' : 'hsl(35, 70%, 55%)'} opacity="0.6" transform="rotate(30 7 7)" />
              </svg>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default DynamicBackground;
