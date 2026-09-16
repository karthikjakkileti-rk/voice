'use client';

import React from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Users,
  Bot,
  PhoneForwarded,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPhoneNumber, formatDuration } from '@/lib/utils';
import { SEEDED_CALLS } from '@/services/mock/mock-data';
import { RevealOnScroll } from './RevealOnScroll';

export function DashboardShowcase() {
  return (
    <section id="dashboard" className="relative py-24 bg-slate-50/70 border-b border-slate-200/80 scroll-mt-24 z-10">
      {/* Backwards compatibility anchor for #showcase */}
      <span id="showcase" className="relative -top-28 block invisible pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll delayMs={0}>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Enterprise Management Suite
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              One cockpit for your entire admissions pipeline.
            </h2>
            <p className="text-base text-slate-600 font-normal">
              Real-time telemetry, synchronized call transcripts, lead CRM qualification, and RAG document controls.
            </p>
          </div>
        </RevealOnScroll>

        {/* Mockup Container */}
        <RevealOnScroll delayMs={100}>
          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-7 shadow-xl shadow-slate-200/60 space-y-6">
            {/* Top Mockup Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 bg-slate-50/80 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Apex Engineering College</h3>
                  <p className="text-xs text-slate-500">Autonomous Admissions Telephony Console</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/apex-college">
                  <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 border-slate-200 hover:bg-white transition-all">
                    <span>Open Live Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Calls',
                  val: '1,284',
                  rate: '+18%',
                  sub: 'Peak Results Season',
                  icon: PhoneCall,
                  color: 'text-indigo-600',
                },
                {
                  label: 'Qualified Leads',
                  val: '842',
                  rate: '65.5% rate',
                  sub: 'Directly Captured',
                  icon: Users,
                  color: 'text-blue-600',
                },
                {
                  label: 'AI Handled',
                  val: '94.2%',
                  rate: 'Autonomous',
                  sub: 'Resolved by Maya AI',
                  icon: Bot,
                  color: 'text-emerald-600',
                },
                {
                  label: 'Staff Handoffs',
                  val: '5.8%',
                  rate: 'VIP Transfers',
                  sub: 'Senior Dean Escalation',
                  icon: PhoneForwarded,
                  color: 'text-amber-600',
                },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div
                    key={idx}
                    className="bg-slate-50/70 p-4.5 rounded-2xl border border-slate-200/80 hover:bg-white hover:shadow-md hover:border-indigo-200 transition-all duration-200 space-y-2 cursor-default group"
                  >
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                      <span>{m.label}</span>
                      <Icon className={`w-4 h-4 ${m.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{m.val}</span>
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> {m.rate}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{m.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Activity Preview: Recent Call Sessions */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Recent Admissions Call Sessions</h4>
                  <Badge variant="primary" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                    Live Telemetry
                  </Badge>
                </div>
                <Link href="/apex-college/calls" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                  <span>View All Calls</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              </div>

              <div className="divide-y divide-slate-200/60">
                {SEEDED_CALLS.slice(0, 3).map((call) => (
                  <div
                    key={call.id}
                    className="py-3 px-2 rounded-xl flex items-center justify-between gap-4 text-xs hover:bg-white transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{formatPhoneNumber(call.caller_number)}</p>
                        <p className="text-slate-500 text-[11px] truncate max-w-xs sm:max-w-md">
                          {call.summary?.summary || call.summary_text || 'B.Tech CSE fee inquiry & scholarship eligibility.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block font-mono text-slate-600 font-medium">
                        {formatDuration(call.duration_seconds)}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {call.sentiment || 'positive'}
                      </span>
                      <Link href={`/apex-college/calls/${call.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 hover:bg-indigo-50">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
