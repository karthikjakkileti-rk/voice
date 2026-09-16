'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrentOrg } from '@/context/tenant-context';
import { School, ChevronDown, Check, Plus, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function OrgSelector() {
  const { currentOrganization, organizations, switchOrganization } = useCurrentOrg();
  const [open, setOpen] = useState(false);
  const router = useRouter();
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all text-left max-w-[240px] sm:max-w-[280px]"
        aria-label="Select institution"
      >
        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <School className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
            {currentOrganization?.name || 'Select Institution'}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize truncate">
            {currentOrganization?.institution_type || 'Tenant'}
          </p>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform shrink-0', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Your Institutions
          </div>

          <div className="max-h-60 overflow-y-auto my-1">
            {organizations.map((org) => {
              const isSelected = org.id === currentOrganization?.id || org.slug === currentOrganization?.slug;
              return (
                <button
                  key={org.id}
                  onClick={() => {
                    switchOrganization(org.slug);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors',
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="truncate">
                      <p className="truncate font-medium">{org.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal truncate">/{org.slug}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 px-2">
            <button
              onClick={() => {
                setOpen(false);
                router.push('/onboarding');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Institution</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
