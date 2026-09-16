'use client';

import React from 'react';
import { AlertCircle, RotateCcw, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  isForbidden?: boolean;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'An error occurred while communicating with the backend. Please try again.',
  isForbidden = false,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/20">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 shadow-sm">
        {isForbidden ? <ShieldAlert className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
        {isForbidden ? 'Access Denied' : title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {isForbidden
          ? "You don't have permission to perform this action or view this resource in this institution."
          : message}
      </p>
      {onRetry && !isForbidden && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Retry</span>
        </Button>
      )}
    </div>
  );
}
