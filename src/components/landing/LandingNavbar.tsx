'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Home,
  Layers,
  Bot,
  GitMerge,
  BarChart3,
  Calculator,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'product', label: 'Product', icon: Layers },
  { id: 'ai-counselor', label: 'AI Counselor', icon: Bot },
  { id: 'how-it-works', label: 'How It Works', icon: GitMerge },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'roi-calculator', label: 'ROI Calculator', icon: Calculator },
];

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll position for morphing navbar state & progress
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 48);

          // Scroll progress calculation
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const current = (scrollY / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, current)));
          }

          // Top/bottom edge case overrides for single active section accuracy
          if (scrollY < 120) {
            setActiveSection('home');
          } else if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100) {
            setActiveSection('roi-calculator');
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section Observer using IntersectionObserver
  useEffect(() => {
    const sectionIds = ['home', 'product', 'ai-counselor', 'how-it-works', 'dashboard', 'roi-calculator'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Avoid changing from home if user is still near top
            if (id === 'home' || window.scrollY > 120) {
              setActiveSection(id);
            }
          }
        },
        {
          rootMargin: '-25% 0px -50% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Keyboard accessibility: Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const activeItem = useMemo(
    () => NAV_ITEMS.find((item) => item.id === activeSection) || NAV_ITEMS[0],
    [activeSection]
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (id === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setActiveSection('home');
      return;
    }

    const target = document.getElementById(id);
    if (target) {
      const navOffset = 84;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out flex justify-center px-3 sm:px-6 pointer-events-none ${
        isScrolled ? 'pt-2.5 sm:pt-3.5' : 'pt-0'
      }`}
    >
      <header
        className={`relative pointer-events-auto transition-all duration-300 ease-out flex items-center justify-between overflow-hidden ${
          isScrolled
            ? 'w-full max-w-6xl h-14 sm:h-15 px-3.5 sm:px-6 rounded-2xl sm:rounded-full bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-indigo-950/5 ring-1 ring-slate-900/5'
            : 'w-full max-w-7xl h-18 sm:h-20 px-4 sm:px-8 bg-white/40 backdrop-blur-sm border-b border-indigo-100/40'
        }`}
      >
        {/* Subtle Progress Bar (micro 2px line along top edge of navbar pill) */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-transparent pointer-events-none opacity-90"
          aria-hidden="true"
        >
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-400 transition-all duration-100 ease-out shadow-xs shadow-indigo-500/30"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Left: Brand Logo & "YOU ARE HERE" Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="Edu-Voice AI Home"
          >
            <div
              className={`rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-all duration-200 ${
                isScrolled ? 'w-8 h-8' : 'w-9 h-9'
              }`}
            >
              <Sparkles className={isScrolled ? 'w-4 h-4' : 'w-4.5 h-4.5'} />
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-extrabold text-slate-900 tracking-tight transition-all duration-200 ${
                  isScrolled ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                }`}
              >
                Edu-Voice AI
              </span>
              <span
                className={`hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 ${
                  isScrolled ? 'scale-90 opacity-90' : ''
                }`}
              >
                Education AI
              </span>
            </div>
          </Link>

          {/* Desktop "YOU ARE HERE" Dynamic Badge */}
          <div
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50/80 border border-indigo-200/60 text-[11px] font-semibold text-indigo-700 shadow-2xs transition-all"
            aria-live="polite"
            aria-label={`Current Section: ${activeItem.label}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">YOU ARE HERE •</span>
            <span
              key={activeSection}
              className="text-indigo-700 font-bold transition-all duration-200 animate-in fade-in slide-in-from-bottom-1"
            >
              {activeItem.label}
            </span>
          </div>
        </div>

        {/* Center: Section-Aware Interactive Nav Tabs */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-1.5"
          aria-label="Landing Page Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isActive
                    ? 'text-indigo-700 bg-indigo-50/90 shadow-2xs border border-indigo-200/70 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>

                {/* Animated active underline dot */}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-600 rounded-full animate-in fade-in zoom-in-75 duration-200" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-2.5 shrink-0">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className={`text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80 font-semibold transition-all ${
                isScrolled ? 'h-8 px-2.5 text-xs' : 'h-9 px-3 text-sm'
              }`}
            >
              Sign In
            </Button>
          </Link>
          <Link href="/apex-college">
            <Button
              variant="outline"
              size="sm"
              className={`border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold hidden lg:inline-flex transition-all ${
                isScrolled ? 'h-8 px-3 text-xs' : 'h-9 px-3.5 text-xs'
              }`}
            >
              Live Demo
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button
              variant="primary"
              size="sm"
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shadow-sm shadow-indigo-500/20 transition-all ${
                isScrolled ? 'h-8 px-3.5 text-xs rounded-lg' : 'h-9 px-4 text-xs rounded-xl'
              }`}
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation Header (Right Side: Active Indicator + Menu Toggle) */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Current Section Tag */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="truncate max-w-[90px]">{activeItem.label}</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer (Compact Glass Overlay) */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed top-18 inset-x-3 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Active section header in mobile drawer */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Section:</span>
              <span className="font-bold text-indigo-600">{activeItem.label}</span>
            </div>
            <span className="text-[10px] text-slate-400">Esc to close</span>
          </div>

          <nav className="flex flex-col space-y-1.5 text-sm font-semibold text-slate-700">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      Active
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center h-10 text-xs font-semibold border-slate-200">
                Sign In
              </Button>
            </Link>
            <Link href="/apex-college" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center h-10 text-xs font-semibold border-slate-200">
                Live Demo
              </Button>
            </Link>
            <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="primary"
                className="w-full justify-center h-10 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
