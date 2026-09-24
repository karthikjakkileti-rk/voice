'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useCurrentOrg } from '@/context/tenant-context';
import { ErrorState } from '../shared/error-state';
import { X, Sparkles, LayoutDashboard, Bot, Phone, PhoneCall, Users, BookOpen, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

import { NAVIGATION_SECTIONS } from './navigation-config';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentOrganization, loading, notFound, orgSlug } = useCurrentOrg();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-row">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Drawer Navigation */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-[#FAFAF8] dark:bg-slate-900 h-full flex flex-col p-4 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">Edu-Voice AI</span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Admissions Platform</span>
                </div>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-3 space-y-4 overflow-y-auto custom-scrollbar">
              {NAVIGATION_SECTIONS.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="px-3 pt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {section.title}
                  </div>
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
                        onClick={() => setMobileNavOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors',
                          isActive
                            ? 'bg-slate-900 text-white dark:bg-indigo-600 shadow-sm shadow-slate-900/10'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                        )}
                      >
                        <Icon className={cn('w-4 h-4', isActive ? 'text-amber-300 dark:text-white' : 'text-slate-400')} />
                        <span className="truncate flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 max-w-[1600px] w-full mx-auto">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-48 rounded-xl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
              </div>
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          ) : notFound ? (
            <ErrorState
              title="Institution Not Found"
              message={`The institution with slug '/${orgSlug}' could not be resolved or you do not have membership in this organization.`}
            />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
