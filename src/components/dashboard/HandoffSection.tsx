'use client';

import React from 'react';
import Link from 'next/link';
import {
  PhoneForwarded,
  Bot,
  Users,
  ArrowRight,
  PhoneCall,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Agent, Call, UsageSummary } from '@/types/api';
import { formatTimeAgo, formatPhoneNumber } from '@/lib/utils';

interface HandoffSectionProps {
  activeAgent: Agent | null;
  summary: UsageSummary | null;
  recentHandoffCalls: Call[];
  orgSlug: string;
}

export function HandoffSection({
  activeAgent,
  summary,
  recentHandoffCalls,
  orgSlug,
}: HandoffSectionProps) {
  const handoffConfig = activeAgent?.handoff_config;
  const isEnabled = handoffConfig?.human_handoff_enabled ?? false;
  const handoffNumber = handoffConfig?.human_handoff_number || null;
  const condition = handoffConfig?.human_handoff_condition || 'on_request_or_unknown';
  const handoffCount = summary?.human_handoff_count ?? recentHandoffCalls.length;
  const counselorName = activeAgent?.name || 'AI Counselor';

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-6">
      {/* Section Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <PhoneForwarded className="w-4 h-4 text-amber-600 shrink-0" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              AI → Human Escalation Desk
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-normal leading-snug">
            Configured escalation pathway from {counselorName} to admissions staff counselors.
          </p>
        </div>

        <Badge
          variant={isEnabled ? 'primary' : 'neutral'}
          size="sm"
          className="text-[10px] font-bold shrink-0"
        >
          {isEnabled ? 'Warm Transfer' : 'Autonomous'}
        </Badge>
      </div>

      {/* Visual Escalation Flow Architecture Diagram — Vertical Stepped Sequence */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-50/40 via-slate-50 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-200/70 dark:border-slate-800 space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
          Escalation Protocol Architecture
        </span>

        {/* Phase 1: AI Counselor */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Phase 1 • Autonomous
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {counselorName}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">Autonomous candidate intake</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        </div>

        {/* Connector */}
        <div className="flex justify-center -my-1 text-slate-300 font-bold text-xs">
          ↓
        </div>

        {/* Phase 2: Decision Trigger Rule */}
        <div className="p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 shadow-2xs space-y-0.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
            Phase 2 • Decision Trigger Rule
          </span>
          <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
            Caller Request or Complex Inquiry
          </p>
          <p className="text-[10px] text-amber-800 dark:text-amber-300 font-mono">
            Rule: {condition.replace(/_/g, ' ')}
          </p>
        </div>

        {/* Connector */}
        <div className="flex justify-center -my-1 text-slate-300 font-bold text-xs">
          ↓
        </div>

        {/* Phase 3: Human Staff Escalation Desk */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Phase 3 • Staff Escalation Desk
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Admissions Staff Counselor
              </h4>
              <p className="text-[10px] text-slate-500 font-mono truncate">
                {handoffNumber ? `Line: ${handoffNumber}` : 'Line: +91 98765 00001'}
              </p>
            </div>
          </div>
          <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-slate-400'} shrink-0`} />
        </div>
      </div>

      {/* Real Recent Handoff Inquiries */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Recent Escalated Candidate Sessions
        </h4>

        {recentHandoffCalls.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 text-center text-xs text-slate-500">
            No inquiries currently requiring staff escalation. All recent calls resolved autonomously.
          </div>
        ) : (
          <div className="space-y-2">
            {recentHandoffCalls.slice(0, 3).map((call) => (
              <div
                key={call.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 flex items-center justify-center font-bold shrink-0">
                    <PhoneForwarded className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                        {formatPhoneNumber(call.caller_number)}
                      </span>
                      {call.lead_name && (
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                          • {call.lead_name}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      Reason: {call.handoff_reason || 'Staff assistance requested'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    {formatTimeAgo(call.started_at || call.created_at)}
                  </span>
                  <Link href={`/${orgSlug}/calls/${call.id}`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs font-bold">
                      View Call
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
