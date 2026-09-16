'use client';

import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Lightbulb, CheckCircle2 } from 'lucide-react';

interface OnboardingAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStage: number;
}

const STAGE_TIPS: Record<number, { title: string; tips: string[] }> = {
  1: {
    title: 'Institution Profile Guidelines',
    tips: [
      'Enter your institution’s full registered name as it appears in AICTE / UGC / State Council approvals.',
      'The URL slug will form your team’s dedicated dashboard path (e.g., app.eduvoice.ai/apex-college).',
      'The primary phone number is used for administrative notifications and billing verification.',
    ],
  },
  2: {
    title: 'Document Grounding Best Practices',
    tips: [
      'Upload the official Admissions Brochure / Prospectus containing course intake numbers and fee structures.',
      'Ensure tuition fees, quota percentages, and hostel fee breakdowns are included.',
      'Maya strictly answers with verified facts from your uploaded documents to ensure zero hallucinations.',
    ],
  },
  3: {
    title: 'AI Counselor Voice & Greeting',
    tips: [
      'Maya is calibrated for Indian English and Hindi admissions queries with empathetic pacing.',
      'Keep your welcome greeting concise (2-3 sentences) so callers immediately know which courses you offer.',
      'You can adjust cadence (0.8x to 1.3x) based on whether your applicants prefer deliberate or brisk dialogue.',
    ],
  },
  4: {
    title: 'Telephony & Staff Escalation Setup',
    tips: [
      'Your assigned Exotel Virtual DID line handles unlimited concurrent student callers with zero hold time.',
      'Configure an escalation phone number (e.g. Senior Admissions Dean) for complex management quota queries.',
      'Run the interactive test call to experience how Maya answers and greets applicants.',
    ],
  },
  5: {
    title: 'Launching Your Autonomous Portal',
    tips: [
      'Launching initializes your tenant organization, provisions your AI voice counselor, and indexes your documents.',
      'After launch, you will be redirected to your live telemetry dashboard to monitor incoming calls and CRM leads.',
    ],
  },
};

export function OnboardingAssistantModal({
  open,
  onOpenChange,
  currentStage,
}: OnboardingAssistantModalProps) {
  const currentTip = STAGE_TIPS[currentStage] || STAGE_TIPS[1];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Admissions Setup Assistant"
      description="Contextual guidance for configuring your institutional AI telephony team."
      maxWidth="md"
    >
      <div className="space-y-5 my-2">
        {/* Header Avatar Box */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Maya</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                Setup Advisor
              </span>
            </h4>
            <p className="text-xs text-slate-500">Admissions counselor deployment guidance</p>
          </div>
        </div>

        {/* Tip Content */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>{currentTip.title}</span>
          </h4>

          <div className="space-y-2.5">
            {currentTip.tips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold"
          >
            Got It, Continue
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
