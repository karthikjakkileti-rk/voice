'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from './RevealOnScroll';

export function CallIntelligenceSection() {
  return (
    <section className="py-24 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll delayMs={0}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Post-Call Synthesized Analytics
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Complete call intelligence at your fingertips.
            </h2>
            <p className="text-base text-slate-600 font-normal">
              Every conversation is automatically transcribed, analyzed for student sentiment, and summarized into actionable follow-up tasks.
            </p>
          </div>
        </RevealOnScroll>

        {/* Detailed Call Preview Card */}
        <RevealOnScroll delayMs={100}>
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6 hover:shadow-2xl transition-shadow duration-300">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Call Intelligence Dossier #call_apex_001</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Completed
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Caller: Aarav Sharma (+91 98765 43210) • Agent: Maya</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/apex-college/calls/call_apex_001">
                  <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-50 transition-all">
                    <span>Open Full Diagnostic</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* 3 Metric Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-indigo-200 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Call Duration
                </span>
                <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                  02m 48s (7 turns)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-indigo-200 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Candidate Sentiment
                </span>
                <span className="text-base font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Highly Positive (0.88)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-indigo-200 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Qualification Score
                </span>
                <span className="text-base font-bold text-indigo-700 font-mono mt-0.5 block">
                  92 / 100 (Interested)
                </span>
              </div>
            </div>

            {/* Transcript Snippet Box */}
            <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Synchronized Turn Transcript
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    S
                  </span>
                  <div className="p-3 rounded-2xl bg-white text-slate-700 max-w-[85%] border border-slate-200/60 shadow-2xs">
                    &quot;Is hostel accommodation guaranteed for outstation students?&quot;
                  </div>
                </div>

                <div className="flex items-start gap-2.5 flex-row-reverse">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    M
                  </span>
                  <div className="p-3 rounded-2xl bg-indigo-50/90 text-indigo-950 max-w-[85%] border border-indigo-100 shadow-2xs">
                    &quot;Yes, Aarav! We have separate AC and non-AC residential blocks for boys and girls with 24/7 security and Wi-Fi. Non-AC 2-sharing is ₹60,000/year including mess.&quot;
                  </div>
                </div>
              </div>
            </div>

            {/* AI Synthesis Summary Box */}
            <div className="p-4 rounded-2xl bg-indigo-900 text-white space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-200 font-semibold">
                <Sparkles className="w-4 h-4 text-indigo-300" />
                <span>AI Executive Synthesis</span>
              </div>
              <p className="text-slate-100 leading-relaxed text-xs">
                Aarav Sharma inquired regarding B.Tech CSE fee structure and hostel facilities. Candidate confirmed 92% PCM in CBSE. Maya offered 25% Merit scholarship. Candidate requested campus visit on Saturday.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-lg bg-indigo-800 text-indigo-200 font-medium">
                  Action: Scheduled Campus Tour
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-800 text-indigo-200 font-medium">
                  Counselor Assigned: Rajesh Kumar
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
