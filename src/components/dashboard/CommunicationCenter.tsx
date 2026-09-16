'use client';

import React from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Clock,
  PhoneIncoming,
  PhoneOutgoing,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  PhoneForwarded,
} from 'lucide-react';
import { Call, UsageSummary } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDuration, formatTimeAgo, formatPhoneNumber } from '@/lib/utils';

interface CommunicationCenterProps {
  calls: Call[];
  summary: UsageSummary | null;
  totalCallsInDb?: number;
  orgSlug: string;
}

export function CommunicationCenter({
  calls,
  summary,
  totalCallsInDb,
  orgSlug,
}: CommunicationCenterProps) {
  // Lifetime Scoped Metrics
  const lifetimeCalls = summary?.total_calls ?? totalCallsInDb ?? calls.length;
  const lifetimeMinutes = summary?.total_minutes ?? summary?.total_voice_minutes ?? 0;
  const avgDurationSeconds = summary?.average_call_duration_seconds ?? 0;

  // Batch Scoped Metrics
  const batchCallsCount = calls.length;
  const batchCompleted = calls.filter((c) => c.status === 'completed').length;
  const batchTransferred = calls.filter(
    (c) => Boolean(c.transferred_to_human) || c.status === 'transferred'
  ).length;
  const batchInbound = calls.filter((c) => !c.direction || c.direction === 'inbound').length;
  const batchOutbound = calls.filter((c) => c.direction === 'outbound').length;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 space-y-4.5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              COMMUNICATION CENTER
            </h2>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Voice & Telephony</span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Institutional call traffic, connect durations, carrier routing, and counselor session activity.
          </p>
        </div>

        <Link href={`/${orgSlug}/calls`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5 h-8 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <span>All Calls ({lifetimeCalls.toLocaleString()})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Telephony Operational Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Calls */}
        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Calls
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            {lifetimeCalls.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">All-time handled</p>
        </div>

        {/* Voice Minutes */}
        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Voice Minutes
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            {lifetimeMinutes.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {avgDurationSeconds > 0 ? `Avg ${Math.round(avgDurationSeconds)}s / call` : 'Connected minutes'}
          </p>
        </div>

        {/* Recent Batch Sessions */}
        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Recent Batch
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            {batchCallsCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {batchInbound} In • {batchOutbound} Out
          </p>
        </div>

        {/* Session Status */}
        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Resolved / Handoff
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            {batchCompleted}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {batchTransferred} Handoff{batchTransferred === 1 ? '' : 's'} to staff
          </p>
        </div>
      </div>

      {/* Telephony Session Activity Stream */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-0.5">
          <span>Recent Telephony Activity</span>
          <span className="font-normal text-[11px] text-slate-400 lowercase">click session to inspect</span>
        </div>

        {calls.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            No call records available in current batch.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            {calls.slice(0, 4).map((call) => {
              const isHandoff = Boolean(call.transferred_to_human) || call.status === 'transferred';
              const isFailed = call.status === 'no_answer' || call.status === 'busy' || call.status === 'failed';
              const isInbound = !call.direction || call.direction === 'inbound';

              return (
                <Link
                  key={call.id}
                  href={`/${orgSlug}/calls/${call.id}`}
                  className="flex items-center justify-between p-3 hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition-colors group text-xs"
                >
                  {/* Direction icon + Caller Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 ${
                        isHandoff
                          ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 border border-purple-200/60'
                          : isFailed
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200/60'
                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 border border-indigo-200/60'
                      }`}
                    >
                      {isInbound ? <PhoneIncoming className="w-3.5 h-3.5" /> : <PhoneOutgoing className="w-3.5 h-3.5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                          {call.lead_name || formatPhoneNumber(call.caller_number)}
                        </span>
                        {call.lead_name && (
                          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline truncate">
                            {formatPhoneNumber(call.caller_number)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {call.agent_name || 'AI Counselor'}
                        {call.call_outcome && ` • ${call.call_outcome.replace(/_/g, ' ')}`}
                      </p>
                    </div>
                  </div>

                  {/* Telephony Duration, Status & Link */}
                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div>
                      <span
                        className={`inline-block px-2 py-0.2 rounded text-[10px] font-semibold uppercase font-mono ${
                          isHandoff
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60'
                            : isFailed
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60'
                        }`}
                      >
                        {call.status || 'completed'}
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono font-semibold mt-0.5">
                        {formatDuration(call.duration_seconds)}
                      </p>
                    </div>

                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
