'use client';

import React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  ArrowRight,
  TrendingUp,
  Clock,
  Phone,
  UserCheck,
} from 'lucide-react';
import { UsageSummary } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface UsageAndPlanSectionProps {
  summary: UsageSummary | null;
  orgSlug: string;
}

export function UsageAndPlanSection({
  summary,
  orgSlug,
}: UsageAndPlanSectionProps) {
  const totalCalls = summary?.total_calls || 0;
  const totalMinutes = summary?.total_minutes || summary?.total_voice_minutes || 0;
  const totalLeads = summary?.total_leads_captured || 0;

  return (
    <div className="rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Usage & Plan
          </h3>
        </div>

        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60">
          Enterprise
        </span>
      </div>

      {/* Plan Details & Consumption Metrics */}
      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center justify-between text-[11px]">
          <span>Voice Minutes</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {totalMinutes.toLocaleString()} mins
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span>Total Calls Handled</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">
            {totalCalls.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span>Leads Captured</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">
            {totalLeads.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Subtle Link */}
      <div className="pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
        <Link
          href={`/${orgSlug}/analytics`}
          className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors py-1"
        >
          <span>View Usage Telemetry</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
