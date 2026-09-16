'use client';

import React from 'react';
import { OrgSelector } from './OrgSelector';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/context/auth-context';
import { Menu, Sparkles, Activity } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface HeaderProps {
  onOpenMobileNav: () => void;
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  const { demoMode } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile Menu Trigger + Org Selector */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <OrgSelector />
      </div>

      {/* Right: Demo status indicator + User profile */}
      <div className="flex items-center gap-3">
        {demoMode ? (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Sandbox Mode</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>FastAPI v1 Connected</span>
          </div>
        )}

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <UserMenu />
      </div>
    </header>
  );
}
