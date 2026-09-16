'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentOrg } from '@/context/tenant-context';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { NAVIGATION_SECTIONS } from './navigation-config';

export interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { orgSlug, currentOrganization, userRole } = useCurrentOrg();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-[#FAFAF8] dark:bg-slate-950 transition-all duration-200 select-none z-30',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
        <Link href={`/${orgSlug}`} className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 flex items-center justify-center text-amber-300 shadow-md shadow-indigo-950/20 shrink-0 border border-indigo-800/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                Edu-Voice AI
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Admissions Platform
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Grouped Navigation List */}
      <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto custom-scrollbar">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pt-1 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            {collapsed && (
              <div className="h-px bg-slate-200/60 dark:bg-slate-800/80 my-2 mx-2" />
            )}

            {section.items.map((item) => {
              const href = item.href(orgSlug);
              const isActive = item.exact
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={href}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group relative',
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-indigo-600 shadow-sm shadow-slate-900/10'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-900/80'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive
                        ? 'text-amber-300 dark:text-white'
                        : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    )}
                  />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-2 shrink-0',
                            isActive
                              ? 'bg-slate-800 text-amber-300 border border-slate-700'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Role & Collapse Footer */}
      <div className="p-3 border-t border-slate-200/70 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm space-y-2">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Institution
              </span>
              <Badge variant="primary" size="sm" className="text-[10px] uppercase font-bold px-1.5 py-0">
                {userRole}
              </Badge>
            </div>
            <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">
              {currentOrganization?.name || 'Apex College'}
            </p>
          </div>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-900 transition-colors text-xs font-medium"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>
    </aside>
  );
}
