'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  ArrowRight,
  Clock,
  ShieldCheck,
  Building2,
  Phone,
  BookOpen,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StageWelcomeProps {
  onStart: () => void;
}

export function StageWelcome({ onStart }: StageWelcomeProps) {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 space-y-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Top Badge & Main Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Autonomous Admissions Telephony</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Let&apos;s build your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600">
            AI communication team.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          Your institution has a unique story, programs, and culture. Together, we&apos;ll configure an autonomous AI counselor that answers candidate questions 24/7 with zero hallucinations.
        </p>
      </div>

      {/* Hero Visual Composition: AI Counselor Preview Card & Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: AI Counselor Persona Preview Card */}
        <div className="md:col-span-6 bg-gradient-to-br from-white via-slate-50 to-indigo-50/50 rounded-3xl border border-slate-200/90 p-7 shadow-xl shadow-slate-200/60 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AI Admission Counselor
              </span>
            </div>
            <span className="text-xs font-bold text-indigo-600">Maya AI</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-600/25 shrink-0">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Senior Admissions Counselor</h3>
              <p className="text-xs text-slate-500">Tuned for Indian Colleges & Universities</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                ● Fluent Indian English & Hindi • 24/7 Ready
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-700 space-y-2 shadow-2xs">
            <p className="font-semibold text-slate-900 text-[11px] text-indigo-700">
              Sample Candidate Dialogue:
            </p>
            <p className="italic text-slate-600 leading-relaxed">
              &ldquo;Hello! Welcome to admissions. I can assist with B.Tech cutoffs, scholarship fee waivers, and hostel room options. Which course would you like to explore?&rdquo;
            </p>
          </div>
        </div>

        {/* Right Column: 3 Fast Setup Milestones */}
        <div className="md:col-span-6 space-y-3.5">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3.5 hover:border-indigo-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">1. Institution Grounding</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Connect your official brochures, fee structures, and course intake catalogs.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3.5 hover:border-indigo-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">2. Dedicated Indian Phone Line</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Assign an Exotel Virtual DID with automated human staff escalation.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3.5 hover:border-indigo-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">3. Verified & Ready to Go Live</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Run an interactive voice test and launch your live telemetry console.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button & Sign In Link */}
      <div className="text-center space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onStart}
            className="w-full sm:w-auto h-14 px-10 text-base font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-600/30 gap-3 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>Let&apos;s Build Your AI</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Setup takes approximately 5–10 minutes</span>
          <span>•</span>
          <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
