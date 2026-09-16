'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80', className)}
      {...props}
    />
  );
}

export function Progress({ value = 0, max = 100, className }: { value?: number; max?: number; className?: string }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', className)}>
      <div
        className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
