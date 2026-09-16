'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Flame,
  PhoneForwarded,
  CalendarCheck,
  ArrowRight,
  CheckCircle2,
  PhoneMissed,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Call, Lead, KnowledgeDocument } from '@/types/api';
import { DemoFollowupTask } from '@/types/demo';
import { formatTimeAgo, formatPhoneNumber } from '@/lib/utils';

interface AttentionPanelProps {
  highIntentLeads: Lead[];
  pendingHandoffs: Call[];
  pendingFollowups: DemoFollowupTask[];
  missedCalls: Call[];
  failedDocs: KnowledgeDocument[];
  orgSlug: string;
}

export function AttentionPanel({
  highIntentLeads,
  pendingHandoffs,
  pendingFollowups,
  missedCalls,
  failedDocs,
  orgSlug,
}: AttentionPanelProps) {
  const totalAttentionItems =
    highIntentLeads.length +
    pendingHandoffs.length +
    pendingFollowups.length +
    missedCalls.length +
    failedDocs.length;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/50 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-100 dark:border-amber-950">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Admissions Triage Desk
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-normal leading-snug">
            Live attention items derived strictly from calls, leads, follow-ups & knowledge.
          </p>
        </div>

        {totalAttentionItems > 0 ? (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white shadow-2xs font-mono shrink-0">
            {totalAttentionItems} Pending
          </span>
        ) : (
          <Badge variant="success" size="sm" className="gap-1 font-semibold shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>All Clear</span>
          </Badge>
        )}
      </div>

      {/* Items list */}
      {totalAttentionItems === 0 ? (
        <div className="p-8 text-center space-y-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Everything is currently in order.
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The AI Counselor is answering candidate calls and resolving queries without open staff escalations.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* 1. Knowledge Document Failure Alert */}
          {failedDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex flex-col gap-2.5 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-rose-900 dark:text-rose-200 truncate block">
                    {doc.title}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-extrabold text-[10px] shrink-0">
                  FAILED
                </span>
              </div>
              <p className="text-[11px] text-rose-700 dark:text-rose-400">
                {doc.error_message || 'Indexing error in semantic vector chunks'}
              </p>
              <div className="pt-2 border-t border-rose-200/60 flex justify-end">
                <Link href={`/${orgSlug}/knowledge`}>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-rose-300 text-rose-700">
                    Fix Document
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {/* 2. High-Intent Leads Needing Human Attention */}
          {highIntentLeads.slice(0, 2).map((lead) => (
            <div
              key={lead.id}
              className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/60 flex flex-col gap-2 text-xs hover:border-amber-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-900 dark:text-white truncate block">
                      {lead.full_name || 'Prospective Candidate'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {formatPhoneNumber(lead.phone_number)}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-black text-[10px] shrink-0">
                  HIGH INTENT
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                Program: <strong>{lead.course_interested || lead.interested_course || 'General Admissions'}</strong>
                {lead.qualification && ` • ${lead.qualification}`}
              </p>

              <div className="pt-2 border-t border-amber-200/50 dark:border-amber-900/50 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  {lead.created_at ? formatTimeAgo(lead.created_at) : 'Active'}
                </span>
                <Link href={`/${orgSlug}/leads/${lead.id}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-7 px-3 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
                  >
                    Contact Student
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {/* 3. Staff Escalations Needing Direct Resolution */}
          {pendingHandoffs.slice(0, 2).map((call) => (
            <div
              key={call.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-2 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <PhoneForwarded className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-900 dark:text-white truncate block">
                      Staff Escalation Request
                    </span>
                    <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {formatPhoneNumber(call.caller_number)}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold text-[10px] shrink-0">
                  TRANSFER
                </span>
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-1">
                Reason: {call.handoff_reason || 'Caller requested senior staff coordination'}
              </p>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatTimeAgo(call.started_at || call.created_at)}
                </span>
                <Link href={`/${orgSlug}/calls/${call.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs font-bold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    Review Call
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {/* 4. Missed / Dropped Inquiries */}
          {missedCalls.slice(0, 2).map((call) => (
            <div
              key={call.id}
              className="p-3.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/50 flex flex-col gap-2 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 flex items-center justify-center font-bold shrink-0">
                    <PhoneMissed className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-900 dark:text-white truncate block">
                      Missed Call
                    </span>
                    <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {formatPhoneNumber(call.caller_number)}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 font-bold text-[10px] shrink-0">
                  MISSED
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                Status: {call.status || 'no_answer'} • {formatTimeAgo(call.started_at || call.created_at)}
              </p>

              <div className="pt-2 border-t border-amber-200/50 flex justify-end">
                <Link href={`/${orgSlug}/calls/${call.id}`}>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-amber-200 text-amber-700">
                    Schedule Callback
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {/* 5. Follow-up Tasks */}
          {pendingFollowups.slice(0, 2).map((task) => (
            <div
              key={task.id}
              className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/50 flex flex-col gap-2 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <CalendarCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white truncate block">
                    {task.lead_name || 'Candidate Task'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 capitalize shrink-0">
                  {task.followup_type.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-1">
                {task.notes || 'Scheduled follow-up task'}
              </p>

              <div className="pt-2 border-t border-purple-200/50 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  {task.scheduled_at ? formatTimeAgo(task.scheduled_at) : 'Scheduled'}
                </span>
                <Link href={`/${orgSlug}/leads`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs font-bold border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    Resolve Task
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
