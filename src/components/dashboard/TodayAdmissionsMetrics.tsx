'use client';

import React from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Users,
  UserCheck,
  PhoneForwarded,
  CalendarCheck,
  Sparkles,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';
import { UsageSummary } from '@/types/api';

interface TodayAdmissionsMetricsProps {
  summary: UsageSummary | null;
  highIntentCount: number;
  pendingFollowupsCount: number;
  orgSlug: string;
}

export function TodayAdmissionsMetrics({
  summary,
  highIntentCount,
  pendingFollowupsCount,
  orgSlug,
}: TodayAdmissionsMetricsProps) {
  const totalCalls = summary?.total_calls || 0;
  const totalMinutes = summary?.total_minutes || 0;
  const qualifiedLeads = summary?.total_leads_captured || 0;
  const handoffsCount = summary?.human_handoff_count || 0;
  const handoffPercentage = summary?.human_handoff_percentage || 0;
  
  // Real AI Resolution Rate = 100% - handoff% (calls handled without human transfer)
  const aiResolutionRate = totalCalls > 0 ? Math.max(0, 100 - handoffPercentage) : 100;

  const metrics = [
    {
      id: 'calls-answered',
      label: 'Calls Answered',
      value: totalCalls.toLocaleString(),
      unit: 'inbound',
      description: 'Candidate calls picked up by Maya with zero wait queue.',
      icon: PhoneCall,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      link: `/${orgSlug}/calls`,
    },
    {
      id: 'students-engaged',
      label: 'Students Engaged',
      value: totalMinutes.toLocaleString(),
      unit: 'voice mins',
      description: 'Total speech streaming duration answering prospectus & fees.',
      icon: Users,
      color: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/50',
      link: `/${orgSlug}/calls`,
    },
    {
      id: 'high-intent-leads',
      label: 'High-Intent Leads',
      value: highIntentCount.toLocaleString(),
      unit: 'candidates',
      description: 'Applicants with strong admission interest and eligible scores.',
      icon: UserCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
      link: `/${orgSlug}/leads?interest=high`,
    },
    {
      id: 'human-handoffs',
      label: 'Human Handoffs',
      value: handoffsCount.toLocaleString(),
      unit: `${handoffPercentage}% rate`,
      description: 'Complex scholarship queries escalated to senior admissions staff.',
      icon: PhoneForwarded,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50',
      link: `/${orgSlug}/calls`,
    },
    {
      id: 'followups-required',
      label: 'Follow-ups Required',
      value: pendingFollowupsCount.toLocaleString(),
      unit: 'pending tasks',
      description: 'Scheduled callbacks, WhatsApp dossiers, and staff reminders.',
      icon: CalendarCheck,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50',
      link: `/${orgSlug}/leads`,
    },
    {
      id: 'ai-resolution-rate',
      label: 'AI Resolution Rate',
      value: `${aiResolutionRate}%`,
      unit: 'autonomous',
      description: 'Student inquiries completely answered without staff intervention.',
      icon: Sparkles,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50',
      link: `/${orgSlug}/analytics`,
    },
  ];

  return (
    <section aria-label="Today's Admissions Outcomes" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Today&apos;s Admissions Outcomes</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Live Session Telemetry
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Real-time admissions impact driven by autonomous voice counseling.
          </p>
        </div>
      </div>

      {/* 6 Outcome Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.id}
              href={m.link}
              className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold border ${m.bgColor}`}
                >
                  <Icon className={`w-4.5 h-4.5 ${m.color}`} />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                    {m.value}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {m.unit}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {m.label}
                </p>
                <p className="text-[10px] text-slate-500 leading-snug mt-1 font-normal line-clamp-2">
                  {m.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
