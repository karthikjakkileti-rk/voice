'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingHeaderProps {
  currentStage: number;
  isSaving?: boolean;
}

export function OnboardingHeader({ currentStage, isSaving = false }: OnboardingHeaderProps) {
  const router = useRouter();

  const handleSaveAndExit = () => {
    const confirmExit = window.confirm(
      'Your current onboarding configuration has been saved in your local session. Would you like to exit to the home page?'
    );
    if (confirmExit) {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                Edu-Voice AI
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                AI Setup
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Autonomous Admissions Telephony Setup
            </p>
          </div>
        </Link>
      </div>

      {/* Sync Status & Save & Exit Button */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>Saving...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Saved just now</span>
              <span className="sm:hidden">Saved</span>
            </span>
          )}
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSaveAndExit}
          className="h-8 px-3 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span>Save & Exit</span>
        </Button>
      </div>
    </header>
  );
}
