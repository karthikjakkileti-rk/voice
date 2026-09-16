'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export function Alert({ className, variant = 'info', title, children, ...props }: AlertProps) {
  const variants = {
    info: 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 border-sky-200 dark:border-sky-800/60',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/60',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800/60',
    error: 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800/60',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
  };

  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border text-sm', variants[variant], className)} {...props}>
      {icons[variant]}
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5 leading-snug">{title}</h5>}
        <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">{children}</div>
      </div>
    </div>
  );
}
