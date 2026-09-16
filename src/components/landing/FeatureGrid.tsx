'use client';

import React from 'react';
import {
  PhoneCall,
  UserCheck,
  PhoneForwarded,
  BookOpen,
  FileText,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export function FeatureGrid() {
  const features = [
    {
      title: 'AI Voice Counseling',
      description: 'Engage prospective students in natural, empathetic voice dialogues in Indian English, Hindi, and bilingual modes.',
      icon: PhoneCall,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Lead Qualification',
      description: 'Automatically extract candidate name, 12th PCM/PCB percentages, entrance ranks, and calculate a 1-100 qualification score.',
      icon: UserCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'SIP Human Handoff',
      description: 'Transfer complex scholarship or management quota queries directly to human admissions staff with full conversation context.',
      icon: PhoneForwarded,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Knowledge Grounding',
      description: 'Ground responses exclusively in your uploaded institution handbooks and fee tables to eliminate hallucinations completely.',
      icon: BookOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Call Intelligence',
      description: 'Review turn-by-turn dialogue transcripts, caller sentiment, key extracted topics, and AI-generated post-call summaries.',
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Analytics & Telemetry',
      description: 'Track hourly inquiry traffic heatmaps, conversion funnel progression, call durations, and voice minute consumption.',
      icon: BarChart3,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  return (
    <section id="product" className="relative py-24 bg-white/90 backdrop-blur-xs scroll-mt-24 z-10">
      {/* Backwards compatibility anchor for #features */}
      <span id="features" className="relative -top-28 block invisible pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll delayMs={0}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Comprehensive Telephony Platform
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything your admissions team needs.
            </h2>
            <p className="text-base text-slate-600 font-normal">
              Designed specifically for the requirements of Indian colleges, universities, and academic coaching centers.
            </p>
          </div>
        </RevealOnScroll>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <RevealOnScroll key={idx} delayMs={idx * 75}>
                <div className="p-7 rounded-3xl border border-slate-200/90 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-200 space-y-4 flex flex-col justify-between group cursor-default h-full">
                  <div className="space-y-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center font-bold group-hover:scale-105 transition-transform duration-200 shadow-2xs`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-normal">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                    <span>Explore capability</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
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
