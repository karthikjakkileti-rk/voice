'use client';

import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Pause, Check, Volume2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VoiceOption {
  id: string;
  name: string;
  language: string;
  gender: 'female' | 'male';
  accent: string;
  tone: string;
  sampleText: string;
}

export const AVAILABLE_VOICES: VoiceOption[] = [
  {
    id: 'maya_indian_female_warm',
    name: 'Maya (Recommended)',
    language: 'English (India) & Hindi',
    gender: 'female',
    accent: 'Indian Neutral',
    tone: 'Warm, Articulate, Empathetic',
    sampleText: 'Hello! Thank you for calling Apex Admissions. I am Maya, your AI admission counselor. How may I assist you today?',
  },
  {
    id: 'rohan_indian_male_professional',
    name: 'Rohan',
    language: 'English (India)',
    gender: 'male',
    accent: 'Indian Professional',
    tone: 'Executive, Authoritative, Clear',
    sampleText: 'Welcome to postgraduate admissions. I can assist with MBA eligibility, fee structures, and placement records.',
  },
  {
    id: 'priya_hindi_female_conversational',
    name: 'Priya',
    language: 'Hindi (India) / Hinglish',
    gender: 'female',
    accent: 'North Indian Conversational',
    tone: 'Friendly, Natural, Engaging',
    sampleText: 'नमस्ते! अपेक्स कॉलेज एडमिशन्स में आपका स्वागत है। मैं आपकी किस प्रकार सहायता कर सकती हूँ?',
  },
  {
    id: 'arjun_telugu_bilingual_male',
    name: 'Arjun',
    language: 'Telugu & English (South)',
    gender: 'male',
    accent: 'South Indian Bilingual',
    tone: 'Polite, Informative, Courteous',
    sampleText: 'నమస్కారం! అపెక్స్ ఇంజనీరింగ్ కాలేజీ అడ్మిషన్స్ విభాగానికి స్వాగతం. బి.టెక్ ప్రవేశాల గురించి ఏ సమాచారం కావాలి?',
  },
];

export interface VoiceSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
}

export function VoiceSelectorModal({
  open,
  onOpenChange,
  selectedVoiceId,
  onSelectVoice,
}: VoiceSelectorModalProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const toggleSample = (voice: VoiceOption) => {
    if (playingId === voice.id) {
      setPlayingId(null);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setPlayingId(voice.id);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(voice.sampleText);
        utterance.rate = 1.0;
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setPlayingId(null), 3000);
      }
    }
  };

  const handleSelect = (voiceId: string) => {
    onSelectVoice(voiceId);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val && typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        onOpenChange(val);
      }}
      title="Select Voice Profile"
      description="Choose a natural AI voice tuned for educational admissions counseling."
      maxWidth="lg"
    >
      <div className="space-y-3 my-2 max-h-[60vh] overflow-y-auto pr-1">
        {AVAILABLE_VOICES.map((voice) => {
          const isSelected = selectedVoiceId === voice.id;
          const isPlaying = playingId === voice.id;

          return (
            <div
              key={voice.id}
              className={cn(
                'p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4',
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 dark:border-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">{voice.name}</span>
                  <Badge variant={voice.gender === 'female' ? 'primary' : 'neutral'} size="sm">
                    {voice.gender}
                  </Badge>
                  {voice.id.includes('maya') && (
                    <Badge variant="success" size="sm" className="gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Seeded Default</span>
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{voice.language}</span> • {voice.accent} • {voice.tone}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-1">
                  &ldquo;{voice.sampleText}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSample(voice)}
                  className="h-8 gap-1.5 text-xs"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Playing</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleSelect(voice.id)}
                  className="h-8 gap-1 text-xs"
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Selected</span>
                    </>
                  ) : (
                    'Select'
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Dialog>
  );
}
