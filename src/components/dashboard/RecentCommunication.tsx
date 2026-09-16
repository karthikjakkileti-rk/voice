'use client';

import React from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  CheckCircle2,
  Clock,
  PhoneForwarded,
  PhoneMissed,
  ArrowUpRight,
  Database,
} from 'lucide-react';
import { Call } from '@/types/api';
import { formatDuration } from '@/lib/utils';

interface RecentCommunicationProps {
  calls: Call[];
  orgSlug: string;
  totalCallsInDb?: number;
}

export function RecentCommunication({
  calls,
  orgSlug,
  totalCallsInDb,
}: RecentCommunicationProps) {
  // All telemetry strictly calculated from the returned recent calls slice
  const callsCount = calls.length;

  const completedCalls = calls.filter(
    (c) => c.status === 'completed'
  ).length;

  const transferredCalls = calls.filter(
    (c) => Boolean(c.transferred_to_human) || c.status === 'transferred'
  ).length;

  const missedCalls = calls.filter(
    (c) => c.status === 'no_answer' || c.status === 'busy' || c.status === 'failed'
  ).length;

  const inboundCalls = calls.filter((c) => !c.direction || c.direction === 'inbound').length;
  const outboundCalls = calls.filter((c) => c.direction === 'outbound').length;

  // Strict average duration: calculated ONLY over connected sessions with duration > 0
  const connectedCalls = calls.filter(
    (c) =>
      (c.status === 'completed' || c.status === 'transferred' || c.status === 'in_progress') &&
      (c.duration_seconds || 0) > 0
  );
  const avgConnectedDuration =
    connectedCalls.length > 0
      ? Math.round(
          connectedCalls.reduce((acc, c) => acc + (c.duration_seconds || 0), 0) /
            connectedCalls.length
        )
      : 0;

  const cards = [
    {
      id: 'recent-calls',
      label: 'Recent Calls (Batch)',
      value: callsCount.toLocaleString(),
      subtext: `${inboundCalls} Inbound • ${outboundCalls} Outbound`,
      icon: PhoneCall,
      accent: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      link: `/${orgSlug}/calls`,
    },
    {
      id: 'completed-calls',
      label: 'Completed Sessions',
      value: completedCalls.toLocaleString(),
      subtext: `${callsCount > 0 ? Math.round((completedCalls / callsCount) * 100) : 0}% of recent batch`,
      icon: CheckCircle2,
      accent: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
      link: `/${orgSlug}/calls?status=completed`,
    },
    {
      id: 'transferred-calls',
      label: 'Staff Transfers',
      value: transferredCalls.toLocaleString(),
      subtext: 'Escalated to staff desk',
      icon: PhoneForwarded,
      accent: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50',
      link: `/${orgSlug}/calls?status=transferred`,
    },
    {
      id: 'missed-calls',
      label: 'Unanswered / Busy',
      value: missedCalls.toLocaleString(),
      subtext: missedCalls === 0 ? 'Zero dropped inquiries' : 'Requires queue callback',
      icon: PhoneMissed,
      accent: missedCalls > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500',
      bg:
        missedCalls > 0
          ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50'
          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800',
      link: `/${orgSlug}/calls?status=no_answer`,
    },
    {
      id: 'avg-duration',
      label: 'Avg Duration',
      value: formatDuration(avgConnectedDuration),
      subtext: `${connectedCalls.length} connected sessions`,
      icon: Clock,
      accent: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/50',
      link: `/${orgSlug}/calls`,
    },
    {
      id: 'telemetry-scope',
      label: 'Dataset Scope',
      value: `${callsCount} Records`,
      subtext: totalCallsInDb ? `Slice of ${totalCallsInDb} total calls` : 'Recent paginated page',
      icon: Database,
      accent: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800',
      link: `/${orgSlug}/calls`,
    },
  ];

  return (
    <section aria-label="Recent Communication Telemetry" className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Recent Admissions Communication
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              recent batch ({callsCount} calls)
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Operational telemetry computed strictly over the recent call session records buffer.
          </p>
        </div>

        <Link
          href={`/${orgSlug}/calls`}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 self-start sm:self-auto"
        >
          <span>All Calls Log</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cards Grid */}
      {callsCount === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          No calls logged yet. Incoming candidate telephone calls will automatically populate this telemetry panel.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.link}
                className={`p-4 rounded-2xl border ${card.bg} hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2 group shadow-2xs`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">
                    {card.label}
                  </span>
                  <Icon className={`w-4 h-4 ${card.accent} shrink-0`} />
                </div>

                <div>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono block tracking-tight">
                    {card.value}
                  </span>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {card.subtext}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

// Retain alias for backward compatibility
export const TodayCommunication = RecentCommunication;
