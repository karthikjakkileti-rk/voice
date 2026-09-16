'use client';

import React, { useEffect, useRef } from 'react';

export function InteractiveEducationBackground() {
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize from -1 to 1, max shift 5px
      const x = ((e.clientX / window.innerWidth) - 0.5) * 8;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 8;
      targetX = Math.max(-5, Math.min(5, x));
      targetY = Math.max(-5, Math.min(5, y));
    };

    const updateParallax = () => {
      // Smooth lerp (10% per frame)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* 1. Base Sky & Lavender Atmosphere Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-indigo-50/30 to-slate-50/80" />

      {/* Top Ambient Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-200/35 via-sky-100/30 to-transparent rounded-full blur-3xl opacity-80" />
      <div className="absolute top-20 -left-20 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
      <div className="absolute top-48 -right-20 w-[450px] h-[450px] bg-purple-200/25 rounded-full blur-3xl" />

      {/* 2. Parallax Animated Decorative Layer (Subtle 3-5px shift) */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        {/* Subtle EdTech Dot Grid Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.035]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="edu-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#4338ca" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#edu-grid-pattern)" />
        </svg>

        {/* Abstract Clouds Layer (Slow CSS Drift) */}
        <div className="absolute top-12 left-0 right-0 h-96 opacity-60 animate-cloud-drift">
          {/* Cloud Puff 1 */}
          <div className="absolute top-10 left-[8%] w-80 h-28 bg-gradient-to-r from-white/90 via-sky-100/60 to-white/70 rounded-full blur-2xl" />
          {/* Cloud Puff 2 */}
          <div className="absolute top-28 right-[12%] w-96 h-36 bg-gradient-to-r from-white/80 via-indigo-100/50 to-white/60 rounded-full blur-2xl" />
          {/* Cloud Puff 3 */}
          <div className="absolute top-44 left-[35%] w-72 h-24 bg-gradient-to-r from-sky-50/90 to-purple-50/70 rounded-full blur-xl" />
        </div>

        {/* Campus & AI Architectural Geometric Motifs (Crisp Line Art) */}
        <svg
          className="absolute top-24 left-6 sm:left-14 w-44 h-44 text-indigo-400/20 animate-float-slow"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* Campus Pillars / Gateway Arch */}
          <path d="M20 80 V35 Q50 15 80 35 V80" strokeDasharray="3 3" />
          <path d="M15 80 H85 M35 80 V40 M65 80 V40 M50 80 V35" />
          <circle cx="50" cy="22" r="4" fill="currentColor" fillOpacity="0.3" />
        </svg>

        <svg
          className="absolute top-36 right-6 sm:right-20 w-48 h-48 text-sky-500/20 animate-float-reverse"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* AI Neural Mesh & Soundwave */}
          <circle cx="50" cy="50" r="30" strokeDasharray="4 4" />
          <circle cx="50" cy="20" r="3.5" fill="currentColor" fillOpacity="0.4" />
          <circle cx="76" cy="65" r="3.5" fill="currentColor" fillOpacity="0.4" />
          <circle cx="24" cy="65" r="3.5" fill="currentColor" fillOpacity="0.4" />
          <path d="M50 20 L76 65 M76 65 L24 65 M24 65 L50 20" opacity="0.6" />
          <path d="M35 50 Q50 38 65 50 T95 50" strokeWidth="1" opacity="0.7" />
        </svg>

        {/* Subtle Floating Sparkles */}
        <div className="absolute top-28 left-1/4 w-3.5 h-3.5 text-indigo-400/40 animate-sparkle-glow">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>
        <div
          className="absolute top-64 right-1/3 w-3 h-3 text-sky-400/40 animate-sparkle-glow"
          style={{ animationDelay: '1.8s' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>
        <div
          className="absolute top-96 left-1/6 w-2.5 h-2.5 text-purple-400/35 animate-sparkle-glow"
          style={{ animationDelay: '3.1s' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
