'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from './RevealOnScroll';

export function FinalCta() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll delayMs={0}>
          <div className="rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-900 to-blue-900 text-white p-8 sm:p-14 text-center shadow-2xl space-y-8 relative overflow-hidden group">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-700 text-indigo-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Started in 15 Minutes</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to give every student a voice?
              </h2>

              <p className="text-base sm:text-lg text-indigo-100 font-normal leading-relaxed">
                Launch your institution&apos;s autonomous AI admission telephony team today. Never miss another admission inquiry.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/onboarding" className="w-full sm:w-auto group/btn">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto h-13 px-8 bg-white hover:bg-slate-100 text-indigo-950 font-bold text-base rounded-xl shadow-lg gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 text-indigo-900 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>

              <Link href="/apex-college" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-13 px-8 bg-indigo-950/60 hover:bg-indigo-950 border-indigo-700 text-white font-semibold text-base rounded-xl gap-2 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>Explore Live Demo</span>
                </Button>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-indigo-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                No credit card required
              </span>
              <span>•</span>
              <span>Indian Telephony Compliant</span>
              <span>•</span>
              <span>Instant Setup</span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
