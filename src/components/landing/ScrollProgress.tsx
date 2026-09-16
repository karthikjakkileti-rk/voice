'use client';

import React, { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let requestRunning = false;

    const handleScroll = () => {
      if (!requestRunning) {
        requestRunning = true;
        requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const current = (window.scrollY / totalHeight) * 100;
            setProgress(Math.min(100, Math.max(0, current)));
          }
          requestRunning = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-500 transition-all duration-75 ease-out rounded-r-full shadow-xs shadow-indigo-500/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
