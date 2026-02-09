import { useState, useEffect } from 'react';
import type { TimePeriod } from '@/types';

interface TimeOfDay {
  period: TimePeriod;
  hour: number;
  minute: number;
  greeting: string;
  skyColors: { top: string; middle: string; bottom: string };
  sunPosition: { x: number; y: number };
  isNight: boolean;
}

export function useTimeOfDay(): TimeOfDay {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const hour = now.getHours();
  const minute = now.getMinutes();

  const getPeriod = (): TimePeriod => {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 21) return 'evening';
    return 'night';
  };

  const period = getPeriod();

  const greeting: Record<TimePeriod, string> = {
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',
    night: 'Good Night',
  };

  const skyColorMap: Record<TimePeriod, { top: string; middle: string; bottom: string }> = {
    morning: {
      top: 'hsl(200, 65%, 78%)',
      middle: 'hsl(35, 75%, 83%)',
      bottom: 'hsl(45, 80%, 87%)',
    },
    afternoon: {
      top: 'hsl(210, 82%, 58%)',
      middle: 'hsl(205, 70%, 72%)',
      bottom: 'hsl(200, 50%, 86%)',
    },
    evening: {
      top: 'hsl(260, 48%, 32%)',
      middle: 'hsl(25, 82%, 52%)',
      bottom: 'hsl(35, 92%, 62%)',
    },
    night: {
      top: 'hsl(230, 60%, 6%)',
      middle: 'hsl(235, 55%, 13%)',
      bottom: 'hsl(240, 40%, 18%)',
    },
  };

  const getSunPosition = () => {
    let progress: number;
    if (hour >= 6 && hour < 21) {
      progress = (hour - 6 + minute / 60) / 15;
    } else {
      const nightHour = hour >= 21 ? hour - 21 : hour + 3;
      progress = (nightHour + minute / 60) / 9;
    }
    const x = 10 + progress * 80;
    const y = 55 - Math.sin(progress * Math.PI) * 48;
    return { x, y };
  };

  return {
    period,
    hour,
    minute,
    greeting: greeting[period],
    skyColors: skyColorMap[period],
    sunPosition: getSunPosition(),
    isNight: period === 'night',
  };
}
