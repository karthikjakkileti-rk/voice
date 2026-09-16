'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Volume2, VolumeX, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface StarNode {
  id: number;
  top: number; // percentage (15% to 85%)
  left: number; // percentage (5% to 92%)
  size: number; // px (20 to 28)
  collected: boolean;
  bursting: boolean;
  delay: number; // animation delay in seconds
  duration: number; // animation duration in seconds
}

const INITIAL_STARS: StarNode[] = [
  { id: 1, top: 22, left: 12, size: 24, collected: false, bursting: false, delay: 0, duration: 6 },
  { id: 2, top: 48, left: 86, size: 22, collected: false, bursting: false, delay: 1.5, duration: 7 },
  { id: 3, top: 68, left: 8, size: 26, collected: false, bursting: false, delay: 2.2, duration: 8 },
  { id: 4, top: 82, left: 80, size: 20, collected: false, bursting: false, delay: 0.8, duration: 6.5 },
];

export function KnowledgeStarGame() {
  const [stars, setStars] = useState<StarNode[]>(INITIAL_STARS);
  const [score, setScore] = useState<number>(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [recentNotification, setRecentNotification] = useState<{ id: number; text: string } | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Safe Web Audio chime on click only
  const playCollectSound = useCallback(() => {
    if (!isSoundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // High sweet melodic chime (A5 to E6)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.12); // E6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio playback fails gracefully without throwing
    }
  }, [isSoundEnabled]);

  const handleCollectStar = (starId: number, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();

    // Trigger sound
    playCollectSound();

    // Trigger score increase & burst
    setScore((prev) => prev + 1);

    setRecentNotification({
      id: Date.now(),
      text: '+1 Knowledge Star!',
    });

    setStars((prev) =>
      prev.map((star) => (star.id === starId ? { ...star, bursting: true, collected: true } : star))
    );

    // After burst animation completes, respawn at a new subtle spot
    setTimeout(() => {
      setStars((prev) =>
        prev.map((star) => {
          if (star.id !== starId) return star;
          // Randomize new position subtly
          const newTop = Math.floor(Math.random() * 65) + 18;
          const newLeft = Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 20) + 75;
          return {
            ...star,
            top: newTop,
            left: newLeft,
            bursting: false,
            collected: false,
          };
        })
      );
    }, 3200);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScore(0);
    setStars(INITIAL_STARS);
  };

  return (
    <>
      {/* 1. Floating Stars Layer (pointer-events-none except on stars themselves) */}
      <div
        className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
        aria-label="Knowledge Star Mini Game Layer"
      >
        {stars.map((star) => {
          if (star.collected && !star.bursting) return null;

          return (
            <div
              key={star.id}
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
              className={`absolute transition-opacity duration-300 ${
                isReducedMotion ? '' : 'animate-float-slow'
              }`}
            >
              {/* If bursting, show particle explosion */}
              {star.bursting ? (
                <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                  <div className="absolute w-12 h-12 rounded-full bg-amber-300/40 animate-ping" />
                  <div className="absolute -top-6 text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shadow-xs animate-bounce whitespace-nowrap">
                    +1 Knowledge ⭐
                  </div>
                  <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
                </div>
              ) : (
                /* Interactive Floating Star Button */
                <button
                  type="button"
                  onClick={(e) => handleCollectStar(star.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCollectStar(star.id, e);
                    }
                  }}
                  aria-label="Collect Knowledge Star easter egg"
                  title="Click to collect knowledge star!"
                  className="group relative pointer-events-auto cursor-pointer p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400/80 transition-transform duration-200 hover:scale-135 active:scale-95"
                >
                  {/* Subtle pulsing background halo */}
                  <span className="absolute -inset-1 bg-amber-400/20 rounded-full blur-xs group-hover:bg-amber-400/40 transition-colors animate-pulse" />

                  {/* Star Icon */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="url(#star-gold-gradient)"
                    className="relative w-full h-full drop-shadow-sm text-amber-400"
                  >
                    <defs>
                      <linearGradient id="star-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <path d="M12 1.5l3.09 6.26L22 8.77l-5 4.87 1.18 6.88L12 17.27l-6.18 3.25L7 13.64 2 8.77l6.91-1.01L12 1.5z" />
                  </svg>

                  {/* Micro hover hint badge */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[9px] font-semibold whitespace-nowrap shadow-xs pointer-events-none">
                    Collect ⭐
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Compact Bottom-Right HUD Game Widget */}
      <aside
        aria-label="Knowledge Star Game Status"
        className="fixed bottom-4 right-4 z-30 pointer-events-auto select-none transition-all duration-300"
      >
        {isCollapsed ? (
          /* Collapsed Pill */
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            aria-label="Expand knowledge stars game panel"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-indigo-950/5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-amber-500">⭐</span>
            <span className="font-mono text-indigo-600">{score}</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          </button>
        ) : (
          /* Expanded Sleek Glass Widget */
          <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-2.5 max-w-[230px] sm:max-w-[250px] transition-all">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="text-sm">🎮</span>
                <span className="tracking-tight text-[11px] sm:text-xs">Explore & Collect ⭐</span>
              </div>
              <div className="flex items-center gap-1">
                {/* Audio Toggle */}
                <button
                  type="button"
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  aria-label={isSoundEnabled ? 'Disable game audio' : 'Enable game audio'}
                  title={isSoundEnabled ? 'Mute Chime' : 'Unmute Chime'}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-500" />}
                </button>
                {/* Collapse Button */}
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  aria-label="Minimize game widget"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Score Display */}
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-100/80">
              <span className="text-[11px] font-semibold text-slate-600">Knowledge Stars:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 text-xs">⭐</span>
                <span className="font-mono font-extrabold text-sm text-indigo-700">{score}</span>
              </div>
            </div>

            {/* Subtext & Quick Action */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span>Find floating stars on page</span>
              {score > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors font-medium"
                  title="Reset counter"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
