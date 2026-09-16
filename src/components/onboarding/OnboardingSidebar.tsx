'use client';

import React from 'react';
import {
  Building2,
  BookOpen,
  Bot,
  PhoneCall,
  Rocket,
  Check,
} from 'lucide-react';

export interface StageInfo {
  number: number;
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ONBOARDING_STAGES: StageInfo[] = [
  {
    number: 1,
    id: 'institution',
    title: 'Institution',
    subtitle: 'Profile & identity',
    icon: Building2,
  },
  {
    number: 2,
    id: 'teach-ai',
    title: 'Teach Your AI',
    subtitle: 'Knowledge documents',
    icon: BookOpen,
  },
  {
    number: 3,
    id: 'ai-counselor',
    title: 'AI Counselor',
    subtitle: 'Voice & persona',
    icon: Bot,
  },
  {
    number: 4,
    id: 'connect-test',
    title: 'Connect & Test',
    subtitle: 'Telephony & handoff',
    icon: PhoneCall,
  },
  {
    number: 5,
    id: 'launch',
    title: 'Launch',
    subtitle: 'Deploy AI portal',
    icon: Rocket,
  },
];

interface OnboardingSidebarProps {
  currentStage: number;
  onSelectStage: (stageNumber: number) => void;
  maxReachedStage: number;
}

export function OnboardingSidebar({
  currentStage,
  onSelectStage,
  maxReachedStage,
}: OnboardingSidebarProps) {
  const progressPercent = Math.round(((currentStage - 1) / (ONBOARDING_STAGES.length - 1)) * 100);

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white/60 backdrop-blur-md lg:border-r border-slate-200/80 p-4 sm:p-6 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Progress Summary Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-50 via-slate-50 to-white border border-indigo-100/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="uppercase tracking-wider text-[10px] text-indigo-600 font-extrabold">
              Build Your AI Team
            </span>
            <span className="font-mono text-indigo-700">{progressPercent}%</span>
          </div>

          <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(8, progressPercent)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Stage <span className="font-bold text-slate-800">{currentStage}</span> of {ONBOARDING_STAGES.length}
          </p>
        </div>

        {/* Vertical Stepper List */}
        <nav aria-label="Onboarding Stages" className="space-y-2">
          {ONBOARDING_STAGES.map((stage) => {
            const isCurrent = currentStage === stage.number;
            const isCompleted = currentStage > stage.number;
            const isClickable = stage.number <= maxReachedStage;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => isClickable && onSelectStage(stage.number)}
                disabled={!isClickable}
                className={`w-full text-left p-3 rounded-2xl transition-all duration-200 flex items-center gap-3.5 group relative ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-600/20'
                    : isCompleted
                    ? 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 shadow-2xs cursor-pointer'
                    : 'bg-transparent text-slate-400 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Step Indicator / Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-transform group-hover:scale-105 ${
                    isCurrent
                      ? 'bg-white/20 text-white shadow-inner'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Stage Label & Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold truncate ${
                        isCurrent ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      0{stage.number} {stage.title}
                    </span>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                  <p
                    className={`text-[10px] truncate ${
                      isCurrent ? 'text-indigo-100' : 'text-slate-500'
                    }`}
                  >
                    {stage.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Trust Tag at Bottom of Sidebar */}
      <div className="pt-6 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1 hidden lg:block">
        <p className="font-semibold text-slate-700">Indian Telephony Compliant</p>
        <p className="text-[10px] text-slate-400">Exotel SIP Trunking • Zero Hallucination RAG</p>
      </div>
    </aside>
  );
}
