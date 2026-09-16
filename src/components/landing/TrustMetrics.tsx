'use client';

import React from 'react';
import { Clock, Zap, Target, TrendingUp } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export function TrustMetrics() {
  const metrics = [
    {
      value: '24/7',
      label: 'AI Voice Availability',
      description: 'Zero missed calls during results season, weekends, or late evenings.',
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      value: '<30s',
      label: 'Instant Response Time',
      description: 'Zero queue hold times across unlimited concurrent student lines.',
      icon: Zap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      value: '100%',
      label: 'Enquiries Captured',
      description: 'Every caller is identified, scored, and logged to your admissions CRM.',
      icon: Target,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      value: '3×',
      label: 'Faster Lead Follow-Up',
      description: 'Automated qualification triggers immediate counselor handoff.',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <section className="py-16 border-y border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll delayMs={0}>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Trusted Admissions Automation
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Built for institutions that never want to miss a student enquiry.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              Equip your admissions department with enterprise-grade autonomous voice agents.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <RevealOnScroll key={idx} delayMs={idx * 80}>
                <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-3 group cursor-default">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center font-bold group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight group-hover:text-indigo-600 transition-colors">
                      {m.value}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{m.label}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.description}</p>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delayMs={350}>
          <div className="mt-8 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              *Illustrative capability metrics based on autonomous voice admissions workflows.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
