'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconColor?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'sky' | 'rose';
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconColor = 'indigo',
  className,
}: MetricCardProps) {
  const iconColors = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    sky: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
  };

  return (
    <Card className={cn('p-5 flex flex-col justify-between hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
        <div className={cn('p-2.5 rounded-xl shrink-0', iconColors[iconColor])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          {trend && (
            <span
              className={cn(
                'font-semibold px-1.5 py-0.5 rounded-md',
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-slate-500 dark:text-slate-400 truncate">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
}
