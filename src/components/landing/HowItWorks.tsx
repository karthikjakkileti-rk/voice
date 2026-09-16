'use client';

import React from 'react';
import { Building2, BookOpen, PhoneCall, Rocket, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Connect your institution',
      description: 'Set up your institution profile, campus locations, academic departments, and counselor access levels.',
      icon: Building2,
    },
    {
      number: '02',
      title: 'Train your AI counselor',
      description: 'Upload official brochures, fee structures, cutoff tables, and hostel FAQs. The AI strictly answers with verified facts.',
      icon: BookOpen,
    },
    {
      number: '03',
      title: 'Connect your phone number',
      description: 'Provision an Exotel virtual DID or map your existing admissions hotline directly to your AI voice counselor.',
      icon: PhoneCall,
    },
    {
      number: '04',
      title: 'Go live in minutes',
      description: 'The AI answers student calls 24/7, qualifies candidate eligibility, and transfers complex queries to senior counselors.',
      icon: Rocket,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 bg-white/90 backdrop-blur-xs border-b border-slate-200/80 scroll-mt-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll delayMs={0}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Simple 4-Step Deployment
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Edu-Voice AI Works
            </h2>
            <p className="text-base text-slate-600 font-normal">
              From brochure upload to your first live autonomous voice call in under 15 minutes.
            </p>
          </div>
        </RevealOnScroll>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <RevealOnScroll key={idx} delayMs={idx * 90}>
                <div className="relative bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-200 space-y-4 flex flex-col justify-between h-full group cursor-default">
                  <div className="space-y-4">
                    {/* Step Header */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black text-slate-300 font-mono group-hover:text-indigo-600 transition-colors">
                        {step.number}
                      </span>
                    </div>

                    {/* Title & Content */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Subtle Step Tag */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>Step {idx + 1} of 4</span>
                    {idx < 3 && <span className="hidden lg:inline-block text-indigo-400 font-bold">→</span>}
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
