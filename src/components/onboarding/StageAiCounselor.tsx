'use client';

import React, { useState } from 'react';
import {
  Bot,
  Volume2,
  Sparkles,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  VoiceSelectorModal,
  AVAILABLE_VOICES,
  VoiceOption,
} from '@/components/agents/VoiceSelectorModal';

export interface CounselorFormData {
  agentName: string;
  voiceId: string;
  welcomeMessage: string;
  voiceSpeed: number;
  language: string;
}

interface StageAiCounselorProps {
  data: CounselorFormData;
  onChange: (updates: Partial<CounselorFormData>) => void;
  institutionName: string;
  errors?: Record<string, string>;
}

export function StageAiCounselor({
  data,
  onChange,
  institutionName,
  errors = {},
}: StageAiCounselorProps) {
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const selectedVoice: VoiceOption =
    AVAILABLE_VOICES.find((v) => v.id === data.voiceId) || AVAILABLE_VOICES[0];

  const handleToggleVoicePreview = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlayingAudio(true);
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        typeof SpeechSynthesisUtterance !== 'undefined'
      ) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(data.welcomeMessage);
          utterance.rate = data.voiceSpeed || 1.0;
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Stage Title & Subtitle */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs">
          <Bot className="w-3.5 h-3.5" />
          <span>Stage 03 • AI Counselor Persona & Voice</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Meet your AI counselor.
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
          Configure how your autonomous voice counselor introduces herself, answers candidate inquiries, and represents {institutionName || 'your institution'}.
        </p>
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: AI Counselor Persona Avatar & Voice Profile */}
        <div className="lg:col-span-5 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl shadow-slate-200/50 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              AI Persona Card
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ready for Calls</span>
            </span>
          </div>

          {/* Large Avatar & Identity */}
          <div className="text-center space-y-3 pt-2">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 mx-auto">
                <Bot className="w-10 h-10" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white">
                ✓
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {data.agentName || 'Maya — Admission Counselor'}
              </h3>
              <p className="text-xs text-indigo-600 font-semibold">
                Autonomous Admission Telephony Counselor
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {institutionName || 'Apex Engineering College'}
              </p>
            </div>
          </div>

          {/* Active Voice Profile Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span>Voice Profile:</span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setVoiceModalOpen(true)}
                className="h-7 px-2.5 text-xs font-semibold border-slate-200"
              >
                Change Voice
              </Button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{selectedVoice.name}</span>
                <Badge variant="primary" size="sm" className="bg-indigo-50 text-indigo-700">
                  {selectedVoice.gender}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500">
                {selectedVoice.language} • {selectedVoice.accent}
              </p>
              <p className="text-[11px] text-slate-600 font-medium italic">
                Tone: {selectedVoice.tone}
              </p>
            </div>
          </div>

          {/* Quick Info Tag */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium leading-relaxed">
              Bilingual mode auto-detects caller language (Indian English & Hindi).
            </span>
          </div>
        </div>

        {/* Right Column: Configuration & Welcome Message */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl shadow-slate-200/50 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Counselor Configuration</h3>
              <p className="text-xs text-slate-500">Greeting, language, and voice rate</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Counselor Name */}
            <Input
              label="Counselor Name / Title"
              placeholder="e.g. Maya — Admission Counselor"
              value={data.agentName}
              onChange={(e) => onChange({ agentName: e.target.value })}
              error={errors.agentName}
              required
            />

            {/* Welcome Greeting */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Welcome Greeting
                </label>
                <button
                  type="button"
                  onClick={handleToggleVoicePreview}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-indigo-600" />
                      <span>Listen to Greeting</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={4}
                value={data.welcomeMessage}
                onChange={(e) => onChange({ welcomeMessage: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none leading-relaxed"
                placeholder="Spoken immediately when a parent or prospective student calls..."
              />
              <p className="text-[11px] text-slate-500 font-normal">
                This message is spoken immediately when an admissions call connects.
              </p>
            </div>

            {/* Voice Speed Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">Speech Cadence / Rate</span>
                <span className="font-mono text-indigo-600 font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                  {data.voiceSpeed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.1"
                value={data.voiceSpeed}
                onChange={(e) => onChange({ voiceSpeed: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>0.8x (Deliberate)</span>
                <span>1.0x (Natural)</span>
                <span>1.3x (Brisk)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Selection Modal */}
      <VoiceSelectorModal
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
        selectedVoiceId={data.voiceId}
        onSelectVoice={(voiceId) => onChange({ voiceId })}
      />
    </div>
  );
}
