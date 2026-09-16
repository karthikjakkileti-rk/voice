'use client';

import React from 'react';
import {
  BookOpen,
  Database,
  Bot,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export function KnowledgeSection() {
  const steps = [
    {
      title: 'Institution Documents',
      desc: 'Upload official admission handbooks, fee tables, scholarship rules, and hostel guidelines (PDF, DOCX, TXT).',
      icon: BookOpen,
      badge: 'Step 1: Ingestion',
    },
    {
      title: 'Vector Knowledge Store',
      desc: 'Content is parsed, embedded into semantic vectors, and indexed for sub-second similarity matching.',
      icon: Database,
      badge: 'Step 2: Vector RAG',
    },
    {
      title: 'AI Admission Counselor',
      desc: 'Maya synthesizes verified institutional chunks into natural, conversational voice replies.',
      icon: Bot,
      badge: 'Step 3: Grounded Inference',
    },
    {
      title: 'Trusted Student Answers',
      desc: 'Every answer contains exact factual numbers, eligibility criteria, and fee disclosures with zero hallucinations.',
      icon: CheckCircle2,
      badge: 'Step 4: Verified Delivery',
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll delayMs={0}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fact-Grounded RAG Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Your AI should know your institution — not the internet.
            </h2>
            <p className="text-base text-slate-600 font-normal">
              Generic LLMs hallucinate inaccurate fees and cutoffs. Edu-Voice AI answers exclusively from your approved institutional documentation.
            </p>
          </div>
        </RevealOnScroll>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <RevealOnScroll key={idx} delayMs={idx * 85}>
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-4 h-full group cursor-default">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {s.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        {s.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% Deterministic Grounding</span>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <RevealOnScroll delayMs={350}>
          <div className="mt-12 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs hover:bg-white hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Zero Hallucination Compliance</h4>
                <p className="text-xs text-slate-500">
                  If an inquiry cannot be matched to verified handbook facts, Maya politely offers to transfer the student to a human counselor.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                Protected by Guardrails
              </span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
