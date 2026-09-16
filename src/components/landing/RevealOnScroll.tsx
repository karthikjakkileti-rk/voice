'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'none' | 'left' | 'right';
  threshold?: number;
  triggerOnce?: boolean;
}

export function RevealOnScroll({
  children,
  className = '',
  delayMs = 0,
  direction = 'up',
  threshold = 0.05,
  triggerOnce = true,
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user prefers reduced motion or IntersectionObserver is unsupported
    if (
      !('IntersectionObserver' in window) ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      setIsVisible(true);
      return;
    }

    const currentRef = domRef.current;
    if (!currentRef) return;

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry && entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        {
          threshold,
          rootMargin: '0px 0px -20px 0px',
        }
      );

      observer.observe(currentRef);

      return () => {
        if (currentRef) observer.unobserve(currentRef);
      };
    } catch {
      setIsVisible(true);
    }
  }, [threshold, triggerOnce]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 16px, 0)';
      case 'left':
        return 'translate3d(16px, 0, 0)';
      case 'right':
        return 'translate3d(-16px, 0, 0)';
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delayMs}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
