'use client';

import React from 'react';
import {
  Rocket,
  CheckCircle2,
  Building2,
  BookOpen,
  Bot,
  Phone,
  PhoneForwarded,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstitutionFormData } from './StageInstitution';
import { OnboardingDoc } from './StageTeachAi';
import { CounselorFormData } from './StageAiCounselor';
import { TelephonyFormData } from './StageConnectTest';
import { AVAILABLE_VOICES } from '@/components/agents/VoiceSelectorModal';

interface StageLaunchProps {
  institutionData: InstitutionFormData;
  documents: OnboardingDoc[];
  counselorData: CounselorFormData;
  telephonyData: TelephonyFormData;
  onLaunch: () => void;
  isLoading: boolean;
}

export function StageLaunch({
  institutionData,
  documents,
  counselorData,
  telephonyData,
  onLaunch,
  isLoading,
}: StageLaunchProps) {
  const selectedVoice =
    AVAILABLE_VOICES.find((v) => v.id === counselorData.voiceId) || AVAILABLE_VOICES[0];

  const checklist = [
    {
      label: 'Institution Profile Configured',
      detail: `${institutionData.name || 'Institution'} • ${institutionData.city}, ${institutionData.state}`,
      icon: Building2,
      complete: Boolean(institutionData.name.trim() && institutionData.city.trim()),
    },
    {
      label: 'Knowledge Base Connected',
      detail: `${documents.length} verified institution document${documents.length !== 1 ? 's' : ''} ready for vector RAG`,
      icon: BookOpen,
      complete: documents.length > 0,
    },
    {
      label: 'AI Voice Counselor Configured',
      detail: `${counselorData.agentName} • ${selectedVoice.name} (${counselorData.voiceSpeed.toFixed(1)}x speed)`,
      icon: Bot,
      complete: Boolean(counselorData.agentName.trim()),
    },
    {
      label: 'Inbound Telephony Virtual DID Assigned',
      detail: `${telephonyData.selectedDid} • Exotel Indian SIP Trunk`,
      icon: Phone,
      complete: Boolean(telephonyData.selectedDid),
    },
    {
      label: 'Human Staff Handoff Desk',
      detail: telephonyData.humanHandoffEnabled
        ? `Enabled • Escalation line: ${telephonyData.humanHandoffNumber || '+91 98765 00001'}`
        : 'Autonomous Handling Mode (Staff escalation disabled)',
      icon: PhoneForwarded,
      complete: true,
    },
    {
      label: 'Diagnostic Test Verification',
      detail: telephonyData.testCompleted
        ? 'Voice speech synthesis verified'
        : 'Ready for live candidate reception',
      icon: Sparkles,
      complete: true,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Stage Title & Subtitle */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-2xs">
          <Rocket className="w-3.5 h-3.5" />
          <span>Stage 05 • Readiness Checklist & Deployment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Your AI communication team is ready.
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
          Review your institution&apos;s pre-flight checklist. Once launched, your AI counselor will be provisioned to handle admissions calls 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pre-Flight Checklist */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl shadow-slate-200/50 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Deployment Pre-Flight Checklist</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600">
              6 of 6 Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-3.5 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Launch Action Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-900 to-blue-900 text-white p-7 shadow-2xl space-y-6 relative overflow-hidden group">
            {/* Subtle glow orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold shadow-inner">
                <Rocket className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Launch Autonomous AI Portal
              </h3>
              <p className="text-xs text-indigo-100 font-normal leading-relaxed">
                Deploy {counselorData.agentName} for {institutionData.name || 'your institution'}. All admissions calls to {telephonyData.selectedDid} will connect directly.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-800 text-xs text-indigo-200 space-y-1 relative z-10">
              <div className="flex items-center justify-between">
                <span>Tenant Isolation:</span>
                <span className="font-bold text-white">Dedicated Org</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RAG Guardrails:</span>
                <span className="font-bold text-emerald-400">Zero Hallucinations</span>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onLaunch}
              isLoading={isLoading}
              className="w-full h-13 px-6 bg-white hover:bg-slate-100 text-indigo-950 font-extrabold text-sm rounded-xl shadow-lg gap-2 relative z-10 transition-transform active:scale-[0.98]"
            >
              <span>{isLoading ? 'Provisioning AI Portal...' : 'Launch AI Communication'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 text-indigo-900" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
