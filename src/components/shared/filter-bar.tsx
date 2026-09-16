'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
}

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  onFilterChange?: (key: string, value: string) => void;
  onReset?: () => void;
  children?: React.ReactNode;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  onFilterChange,
  onReset,
  children,
}: FilterBarProps) {
  const hasActiveFilters = searchQuery !== '' || filters.some((f) => f.value !== '' && f.value !== 'all');

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 pl-9 pr-3.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Dropdown Filters */}
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            className="h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {/* Reset Button */}
        {hasActiveFilters && onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-9 text-xs gap-1.5 text-slate-500">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
