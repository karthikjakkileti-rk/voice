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

interface TodayCommunicationProps {
  calls: Call[];
  orgSlug: string;
}

export function TodayCommunication({
  calls,
  orgSlug,
}: TodayCommunicationProps) {
  // All telemetry strictly calculated from the returned calls dataset
  const callsCount = calls.length;

  const answeredCalls = calls.filter(
    (c) => c.status === 'completed' || c.status === 'in_progress'
  ).length;

  const missedCalls = calls.filter(
    (c) => c.status === 'no_answer' || c.status === 'busy' || c.status === 'failed'
  ).length;

  const inboundCalls = calls.filter((c) => !c.direction || c.direction === 'inbound').length;
  const outboundCalls = calls.filter((c) => c.direction === 'outbound').length;

  const transferredCalls = calls.filter(
    (c) => Boolean(c.transferred_to_human) || c.status === 'transferred'
  ).length;

  const totalDurationSeconds = calls.reduce((acc, c) => acc + (c.duration_seconds || 0), 0);
  const avgDurationSeconds =
    callsCount > 0 ? Math.round(totalDurationSeconds / callsCount) : 0;

  const cards = [
    {
      id: 'total-calls',
      label: 'Recent Call Sessions',
      value: callsCount.toLocaleString(),
      subtext: `${inboundCalls} Inbound • ${outboundCalls} Outbound`,
      icon: PhoneCall,
      accent: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      link: `/${orgSlug}/calls`,
    },
    {
      id: 'answered-calls',
      label: 'Answered Sessions',
      value: answeredCalls.toLocaleString(),
      subtext: `${callsCount > 0 ? Math.round((answeredCalls / callsCount) * 100) : 0}% of recent batch`,
      icon: CheckCircle2,
      accent: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
      link: `/${orgSlug}/calls?status=completed`,
    },
    {
      id: 'transferred-calls',
      label: 'Staff Transfers',
      value: transferredCalls.toLocaleString(),
      subtext: 'Escalated to admissions desk',
      icon: PhoneForwarded,
      accent: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50',
      link: `/${orgSlug}/calls?status=transferred`,
    },
    {
      id: 'missed-calls',
      label: 'Missed / No Answer',
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
      label: 'Average Duration',
      value: formatDuration(avgDurationSeconds),
      subtext: `${Math.round(totalDurationSeconds / 60)}m total session audio`,
      icon: Clock,
      accent: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/50',
      link: `/${orgSlug}/calls`,
    },
    {
      id: 'telemetry-status',
      label: 'Dataset Source',
      value: callsCount > 0 ? 'Active Buffer' : 'Empty Buffer',
      subtext: `${callsCount} calls table records`,
      icon: Database,
      accent: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800',
      link: `/${orgSlug}/calls`,
    },
  ];

  return (
    <section aria-label="Recent Communication Telemetry" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Recent Admissions Communication</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              calls table
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Operational call session telemetry derived strictly from recent telephony interaction records.
          </p>
        </div>

        <Link
          href={`/${orgSlug}/calls`}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
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
