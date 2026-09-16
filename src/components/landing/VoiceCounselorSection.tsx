'use client';

import React, { useState } from 'react';
import {
  Bot,
  Play,
  Pause,
  Volume2,
  CheckCircle2,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from './RevealOnScroll';

export function VoiceCounselorSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleVoice = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
        try {
          window.speechSynthesis.cancel();
          const text =
            'Hello! We offer B.Tech in Computer Science and Engineering with specializations in AI & Machine Learning, Data Science, and Cyber Security. The total intake is 240 seats. Would you like to check the cutoff criteria or fee structure?';
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.0;
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
        } catch {
          setTimeout(() => setIsPlaying(false), 4000);
        }
      } else {
        setTimeout(() => setIsPlaying(false), 4000);
      }
    }
  };

  return (
    <section id="ai-counselor" className="relative py-24 bg-slate-50/70 border-b border-slate-200/80 scroll-mt-24 z-10">
      {/* Backwards compatibility anchor for #counselor */}
      <span id="counselor" className="relative -top-28 block invisible pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Explanatory Content */}
          <div className="lg:col-span-6 space-y-6">
            <RevealOnScroll delayMs={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Natural Voice Agent</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={100}>
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  An empathetic admission counselor that never sleeps.
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  Maya sounds natural, speaks fluent Indian English and Hindi, and responds with sub-second latency to guide prospective applicants and parents through complex admissions decisions.
                </p>
              </div>
            </RevealOnScroll>

            {/* Capability Checklist */}
            <div className="space-y-3.5 pt-2">
              {[
                {
                  title: 'Comprehensive Course Guidance',
                  desc: 'Explains specializations, syllabus highlights, and NBA/NAAC accreditation status.',
                },
                {
                  title: 'Eligibility & Scholarship Calculation',
                  desc: 'Instantly computes fee waivers based on PCM scores, JEE ranks, or sports quotas.',
                },
                {
                  title: 'Hostel, Transport & Campus Info',
                  desc: 'Answers questions on hostel room options, mess menus, and college bus routes.',
                },
                {
                  title: 'Intelligent Human Escalation',
                  desc: 'Transfers callers to admissions officers when a custom payment plan or quota is requested.',
                },
              ].map((item, i) => (
                <RevealOnScroll key={i} delayMs={150 + i * 60}>
                  <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/60 transition-colors">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll delayMs={400}>
              <div className="pt-2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleToggleVoice}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Voice Sample' : 'Listen to Maya Sample'}</span>
                </Button>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Interactive Phone Simulation Card */}
          <div className="lg:col-span-6">
            <RevealOnScroll delayMs={200} direction="left">
              <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-7 space-y-5 hover:shadow-2xl transition-shadow duration-300">
                {/* Phone Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Maya</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                          Online
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">Autonomous Voice Agent</span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                </div>

                {/* Dialogue Transcript Simulation */}
                <div className="space-y-3 text-xs">
                  {/* User Turn */}
                  <div className="p-3.5 rounded-2xl rounded-tl-sm bg-slate-100 text-slate-700 max-w-[90%]">
                    <p className="font-semibold text-slate-900 text-[11px] mb-1">Prospective Student:</p>
                    &quot;Which specializations are available under B.Tech Computer Science?&quot;
                  </div>

                  {/* AI Turn */}
                  <div className="p-4 rounded-2xl rounded-tr-sm bg-indigo-50/90 border border-indigo-100 text-indigo-950 max-w-[95%] ml-auto space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-indigo-900 text-[11px]">Maya (AI Counselor):</span>
                      <span className="text-[10px] font-mono text-indigo-600 font-semibold">0.4s latency</span>
                    </div>
                    <p className="leading-relaxed">
                      &quot;We offer B.Tech CSE in: <strong>AI & Machine Learning</strong>, <strong>Data Science</strong>, and <strong>Cyber Security</strong>. Total intake is 240 seats with NBA accreditation.&quot;
                    </p>
                    <div className="pt-2 border-t border-indigo-100/80 flex items-center justify-between text-[11px] text-indigo-700 font-medium">
                      <span>Source: Academic Syllabus 2026</span>
                      <span className="text-emerald-700 font-semibold">Verified Fact</span>
                    </div>
                  </div>
                </div>

                {/* Waveform Action Bar */}
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-xs"
                      aria-label={isPlaying ? 'Pause audio sample' : 'Play audio sample'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <div>
                      <p className="text-xs font-semibold text-white">Interactive Audio Preview</p>
                      <p className="text-[10px] text-slate-400">Natural Voice Tone • en-IN / Hindi</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 h-4">
                    {[30, 80, 50, 95, 60, 40, 75, 45].map((h, idx) => (
                      <span
                        key={idx}
                        className={`w-1 bg-indigo-400 rounded-full ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
                        style={{
                          height: `${h}%`,
                          animationDelay: `${idx * 100}ms`,
                          animationDuration: '1s',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
