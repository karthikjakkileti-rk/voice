'use client';

import React from 'react';
import { OrgSelector } from './OrgSelector';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/context/auth-context';
import { useCurrentOrg } from '@/context/tenant-context';
import { Menu, Search, Activity, Sparkles } from 'lucide-react';

export interface HeaderProps {
  onOpenMobileNav: () => void;
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  const { demoMode } = useAuth();
  const { currentOrganization } = useCurrentOrg();

  return (
    <header className="h-14 border-b border-slate-200/90 dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 px-3 sm:px-5 flex items-center justify-between gap-3 sticky top-0 z-20 select-none">
      {/* Left: Mobile Trigger + Brand Tag + Org Selector */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-800 shrink-0">
          <span className="font-extrabold text-xs tracking-tight text-slate-900 dark:text-white uppercase font-mono">
            Console
          </span>
        </div>

        <OrgSelector />
      </div>

      {/* Center Utility Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search caller, phone number, agent..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-sans"
            onChange={(e) => {
              // Dispatch custom event or let page listen
              window.dispatchEvent(new CustomEvent('eduvoice:search', { detail: e.target.value }));
            }}
          />
        </div>
      </div>

      {/* Right: Operational Status + Mode + User Menu */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Operational</span>
        </div>

        {demoMode && (
          <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] font-bold tracking-wide uppercase">
            <span>Demo Mode</span>
          </div>
        )}

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <UserMenu />
      </div>
    </header>
  );
}
