'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Phone,
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Building2,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from './RevealOnScroll';

export function HeroSection() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Subtle interactive pointer effect for desktop (max 3px)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const toggleVoicePreview = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlayingAudio(true);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
        try {
          window.speechSynthesis.cancel();
          const text =
            'Hello! Welcome to Apex Engineering College Admissions. I am Maya, your AI admission counselor. We offer four-year B.Tech programs with 25% Merit scholarships for students scoring above 90% in 12th PCM. How can I assist with your course selection today?';
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.0;
          utterance.onend = () => setIsPlayingAudio(false);
          utterance.onerror = () => setIsPlayingAudio(false);
          window.speechSynthesis.speak(utterance);
        } catch {
          setTimeout(() => setIsPlayingAudio(false), 4000);
        }
      } else {
        setTimeout(() => setIsPlayingAudio(false), 4000);
      }
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 scroll-mt-28 z-10">
      {/* Background subtle ambient elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-50/40 via-sky-50/20 to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <RevealOnScroll delayMs={0}>
              {/* Top Pill / Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                <span>Next-Gen Autonomous Admissions Telephony</span>
              </div>
            </RevealOnScroll>

            {/* Main Headline */}
            <RevealOnScroll delayMs={100}>
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                  AI Voice Counselors <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600">
                    for Modern Institutions
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                  Answer every admission enquiry, qualify prospective students, and connect them to your admissions team — 24/7.
                </p>
              </div>
            </RevealOnScroll>

            {/* CTAs */}
            <RevealOnScroll delayMs={200}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link href="/onboarding" className="group">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto h-13 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base rounded-xl shadow-md shadow-indigo-500/25 gap-2.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={toggleVoicePreview}
                  className="w-full sm:w-auto h-13 px-6 bg-white hover:bg-slate-50 border-slate-300 text-slate-700 font-semibold text-base rounded-xl gap-2.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4 text-indigo-600" />
                      <span>Pause Maya Voice</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                      <span>Listen to AI Voice</span>
                    </>
                  )}
                </Button>
              </div>
            </RevealOnScroll>

            {/* Trust Indicator */}
            <RevealOnScroll delayMs={300}>
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
                <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Built for colleges, universities & training institutions
                </span>
                <span className="hidden sm:inline-block text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Zero Hallucinations (RAG-Grounded)
                </span>
                <span className="hidden sm:inline-block text-slate-300">•</span>
                <span>Exotel Indian Telephony</span>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Hero Product Visual (Interactive SaaS Preview Card) */}
          <div className="lg:col-span-5 relative">
            <RevealOnScroll delayMs={150}>
              {/* Subtle card glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/20 via-blue-500/10 to-indigo-500/0 rounded-3xl blur-xl -z-10" />

              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${-mouseOffset.y}deg) rotateY(${mouseOffset.x}deg) translate3d(0, 0, 0)`,
                  transition: 'transform 200ms ease-out',
                }}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/60 space-y-5 transition-shadow duration-200 hover:shadow-2xl"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                        <Bot className="w-6 h-6" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">Maya</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Call
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Senior Admission Counselor AI</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-400 block">Line 1 • Exotel DID</span>
                    <span className="text-xs font-mono font-bold text-slate-700">040-459-01132</span>
                  </div>
                </div>

                {/* Call Context Banner */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Incoming Student Enquiry</p>
                      <p className="text-slate-500 font-mono text-[11px]">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-xs font-semibold shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>02:48</span>
                  </div>
                </div>

                {/* Live Dialogue Snippet */}
                <div className="space-y-2.5">
                  {/* Caller Query */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      S
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-sm bg-slate-100/80 text-slate-700 text-xs leading-relaxed max-w-[88%]">
                      &quot;I scored 92% in 12th PCM. What is the fee structure for B.Tech Computer Science?&quot;
                    </div>
                  </div>

                  {/* AI Maya Answer */}
                  <div className="flex items-start gap-2.5 flex-row-reverse">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      M
                    </div>
                    <div className="p-3 rounded-2xl rounded-tr-sm bg-indigo-50/90 border border-indigo-100 text-indigo-950 text-xs leading-relaxed max-w-[88%] space-y-1">
                      <p>
                        &quot;Congratulations on 92%! The standard tuition for B.Tech CSE is ₹1,40,000 per year. With your 92% score, you qualify for our <strong>25% Merit Scholarship</strong>, reducing it to ₹1,05,000.&quot;
                      </p>
                      <div className="flex items-center gap-1.5 pt-1 text-[10px] text-indigo-700 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Grounded in: 2026-2027 Admissions Handbook (p. 4)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Waveform Indicator */}
                <div className="p-3 rounded-2xl bg-indigo-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-300" />
                    <span className="text-xs font-medium text-indigo-100">Live Voice Stream</span>
                  </div>

                  {/* Simulated Audio Bars */}
                  <div className="flex items-center gap-1 h-5">
                    {[40, 75, 50, 90, 65, 30, 85, 45, 95, 60, 35, 80, 55].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-indigo-400 rounded-full animate-pulse"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${i * 80}ms`,
                          animationDuration: '1.2s',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Status Footer */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Lead Qualification
                    </span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Highly Interested (92/100)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Recommended Action
                    </span>
                    <span className="font-bold text-slate-700 mt-0.5 block truncate">
                      Campus Visit Scheduled
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Link href="/apex-college/calls/call_apex_001" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold justify-center border-slate-200 hover:bg-slate-50">
                      View Call Diagnostic
                    </Button>
                  </Link>
                  <Link href="/apex-college/leads/lead_apex_001" className="flex-1">
                    <Button variant="primary" size="sm" className="w-full text-xs font-semibold justify-center bg-indigo-600 hover:bg-indigo-700 text-white">
                      Open CRM Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
