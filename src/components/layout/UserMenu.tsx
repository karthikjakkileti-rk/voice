'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useCurrentOrg } from '@/context/tenant-context';
import { UserRole } from '@/types/api';
import { LogOut, User, Shield, Sparkles, ChevronDown } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

export function UserMenu() {
  const { user, signOut, activeRole, toggleDemoRole, demoMode, setDemoMode } = useAuth();
  const { userRole } = useCurrentOrg();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const effectiveRole = userRole || activeRole || 'member';

  const roleBadgeVariant: Record<UserRole, 'primary' | 'warning' | 'neutral'> = {
    admin: 'primary',
    staff: 'warning',
    member: 'neutral',
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="User profile menu"
      >
        <div className="text-right hidden md:block">
          <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
            {user?.full_name || 'Admin'}
          </p>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {effectiveRole}
            </span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white dark:ring-slate-900">
          {user?.full_name?.charAt(0) || 'U'}
        </div>

        <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user?.full_name || 'Institution Administrator'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {user?.email || 'admin@institution.edu'}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={roleBadgeVariant[effectiveRole]} size="sm">
                <Shield className="w-3 h-3 mr-1" />
                Role: {effectiveRole.toUpperCase()}
              </Badge>
              {demoMode && (
                <Badge variant="warning" size="sm" className="gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Demo Mode</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Demo Role Switcher (For testing RBAC behaviors in demo) */}
          {demoMode && (
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Simulate RBAC Role
              </p>
              <div className="grid grid-cols-3 gap-1">
                {(['admin', 'staff', 'member'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => toggleDemoRole(r)}
                    className={cn(
                      'px-2 py-1 text-[11px] font-medium rounded-lg capitalize transition-colors',
                      effectiveRole === r
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode Switcher Toggle */}
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Demo Data Provider</span>
            <button
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors',
                demoMode
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              )}
            >
              {demoMode ? 'Active (Demo)' : 'Real API'}
            </button>
          </div>

          {/* Sign Out */}
          <div className="pt-1 px-2">
            <button
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
