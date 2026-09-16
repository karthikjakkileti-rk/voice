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
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Agent, Call, UsageSummary } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTimeAgo, formatPhoneNumber } from '@/lib/utils';

interface HumanHandoffCenterProps {
  calls: Call[];
  agents: Agent[];
  summary: UsageSummary | null;
  orgSlug: string;
}

export function HumanHandoffCenter({
  calls,
  agents,
  summary,
  orgSlug,
}: HumanHandoffCenterProps) {
  // Recent calls that were escalated
  const handoffCalls = calls.filter(
    (c) => Boolean(c.transferred_to_human) || c.status === 'transferred'
  );

  const totalTransfers = summary?.human_handoff_count ?? handoffCalls.length;

  // Active agents with handoff configured
  const agentsWithHandoff = agents.filter(
    (a) => a.handoff_config?.human_handoff_enabled || (a.config as any)?.human_handoff_enabled
  );

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              AI → HUMAN HANDOFF
            </h2>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">{totalTransfers} Total Escalations</span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Warm transfer protocol when prospective students require personalized counselor counseling.
          </p>
        </div>

        <Link href={`/${orgSlug}/calls?status=transferred`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5 h-8 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <span>All Handoffs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Visual Escalation Protocol Workflow */}
      <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
          Escalation Flow Protocol
        </span>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <Bot className="w-3.5 h-3.5 text-indigo-600 mx-auto mb-0.5" />
            <span className="text-[10px] font-bold block text-slate-800 dark:text-slate-200">AI Agent</span>
            <span className="text-[9px] text-slate-400">Intake</span>
          </div>

          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-amber-500 font-bold block mb-0.5 text-xs">!</span>
            <span className="text-[10px] font-bold block text-slate-800 dark:text-slate-200">Query Limit</span>
            <span className="text-[9px] text-slate-400">Threshold</span>
          </div>

          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <PhoneForwarded className="w-3.5 h-3.5 text-purple-600 mx-auto mb-0.5" />
            <span className="text-[10px] font-bold block text-slate-800 dark:text-slate-200">Escalation</span>
            <span className="text-[9px] text-slate-400">Warm Transfer</span>
          </div>

          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-0.5" />
            <span className="text-[10px] font-bold block text-slate-800 dark:text-slate-200">Staff Desk</span>
            <span className="text-[9px] text-slate-400">Resolution</span>
          </div>
        </div>
      </div>

      {/* Recent Escalations List */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
          Recent Counselor Escalations ({handoffCalls.slice(0, 2).length} of {handoffCalls.length})
        </span>

        {handoffCalls.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            No candidate escalations in current batch. Inquiries handled autonomously.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            {handoffCalls.slice(0, 2).map((call) => {
              const reason = call.handoff_reason || 'Candidate requested counselor review';
              const targetNumber = call.transferred_to_phone || 'Staff Desk';

              return (
                <div
                  key={call.id}
                  className="p-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {call.lead_name || formatPhoneNumber(call.caller_number)}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60">
                        {call.agent_name || 'Maya'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">
                      Reason: <span className="text-slate-700 dark:text-slate-300">{reason}</span>
                      {targetNumber && ` • Target: ${targetNumber}`}
                    </p>
                  </div>

                  <Link href={`/${orgSlug}/calls/${call.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 px-2"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
