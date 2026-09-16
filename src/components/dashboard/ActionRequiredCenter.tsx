'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Flame,
  CalendarCheck,
  PhoneForwarded,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Bot,
  Phone,
} from 'lucide-react';
import { Call, Lead, KnowledgeDocument, Agent, PhoneNumber } from '@/types/api';
import { DemoFollowupTask } from '@/types/demo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTimeAgo, formatPhoneNumber } from '@/lib/utils';

interface ActionRequiredCenterProps {
  highIntentLeads: Lead[];
  pendingFollowups: DemoFollowupTask[];
  pendingHandoffs: Call[];
  failedDocs: KnowledgeDocument[];
  inactiveAgents: Agent[];
  unassignedPhones: PhoneNumber[];
  orgSlug: string;
}

export function ActionRequiredCenter({
  highIntentLeads,
  pendingFollowups,
  pendingHandoffs,
  failedDocs,
  inactiveAgents,
  unassignedPhones,
  orgSlug,
}: ActionRequiredCenterProps) {
  const now = Date.now();

  // Overdue followups strictly: scheduled_at < now AND pending
  const overdueFollowups = pendingFollowups.filter(
    (f) => f.scheduled_at && new Date(f.scheduled_at).getTime() < now
  );

  // Unassigned high intent leads: interest_level === 'high' AND no assigned_to_user_id
  const unassignedHighIntent = highIntentLeads.filter((l) => !l.assigned_to_user_id);

  // Total actionable items
  const totalSignals =
    overdueFollowups.length +
    unassignedHighIntent.length +
    failedDocs.length +
    pendingHandoffs.length +
    inactiveAgents.length +
    unassignedPhones.length;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 space-y-4 shadow-xs relative overflow-hidden">
      {/* Visual Distinction Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-amber-500 opacity-90" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 pt-0.5">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              ACTION REQUIRED
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            {totalSignals > 0 ? (
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {totalSignals} {totalSignals === 1 ? 'item needs' : 'items need'} your attention
              </span>
            ) : (
              'All admissions operations are currently nominal'
            )}
          </p>
        </div>

        {totalSignals > 0 ? (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60 font-mono shrink-0">
            {totalSignals} Action{totalSignals === 1 ? '' : 's'}
          </span>
        ) : (
          <Badge variant="success" size="sm" className="gap-1 font-semibold text-xs shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>All Clear</span>
          </Badge>
        )}
      </div>

      {/* Actionable Items List */}
      {totalSignals === 0 ? (
        <div className="p-6 text-center space-y-2 rounded-xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            Everything is up to date
          </h3>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
            No overdue callbacks, knowledge indexing failures, or unassigned student inquiries.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* 1. Overdue Follow-ups */}
          {overdueFollowups.slice(0, 2).map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/50 dark:border-amber-900/40">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    Overdue callback
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {task.lead_name || 'Student'} needs follow-up • <span className="text-amber-700 dark:text-amber-400 font-medium">{formatTimeAgo(task.scheduled_at)}</span>
                  </p>
                </div>
              </div>

              <Link href={`/${orgSlug}/leads`}>
                <Button size="sm" className="h-7.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 shrink-0 shadow-2xs">
                  Open
                </Button>
              </Link>
            </div>
          ))}

          {/* 2. Inactive Agent Alert */}
          {inactiveAgents.slice(0, 1).map((agent) => (
            <div
              key={agent.id}
              className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    AI agent inactive
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {agent.name} • {agent.agent_type?.replace(/_/g, ' ') || 'Admission Counselor'}
                  </p>
                </div>
              </div>

              <Link href={`/${orgSlug}/agents`}>
                <Button size="sm" variant="outline" className="h-7.5 text-xs font-semibold border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 px-3 shrink-0">
                  Activate
                </Button>
              </Link>
            </div>
          ))}

          {/* 3. Knowledge Ingestion Failure */}
          {failedDocs.slice(0, 1).map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200/50 dark:border-rose-900/40">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    Knowledge ingestion failed
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {doc.title} • {doc.error_message || 'Indexing error'}
                  </p>
                </div>
              </div>

              <Link href={`/${orgSlug}/knowledge`}>
                <Button size="sm" variant="outline" className="h-7.5 text-xs font-semibold border-rose-300 text-rose-700 dark:text-rose-400 hover:bg-rose-50 px-3 shrink-0">
                  Review
                </Button>
              </Link>
            </div>
          ))}

          {/* 4. Unassigned High-Intent Leads */}
          {unassignedHighIntent.slice(0, 1).map((lead) => (
            <div
              key={lead.id}
              className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/50 dark:border-amber-900/40">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    Unassigned high-intent lead
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {lead.full_name || formatPhoneNumber(lead.phone_number)} • {lead.course_interested || lead.interested_course || 'Admissions'}
                  </p>
                </div>
              </div>

              <Link href={`/${orgSlug}/leads`}>
                <Button size="sm" variant="outline" className="h-7.5 text-xs font-semibold border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-50 px-3 shrink-0">
                  Assign
                </Button>
              </Link>
            </div>
          ))}

          {/* 5. Staff Escalations */}
          {pendingHandoffs.slice(0, 1).map((call) => (
            <div
              key={call.id}
              className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/50 dark:border-indigo-900/40">
                  <PhoneForwarded className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    Counselor handoff pending
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {call.lead_name || formatPhoneNumber(call.caller_number)} • {call.handoff_reason || 'Staff requested'}
                  </p>
                </div>
              </div>

              <Link href={`/${orgSlug}/calls/${call.id}`}>
                <Button size="sm" variant="outline" className="h-7.5 text-xs font-semibold border-indigo-300 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 px-3 shrink-0">
                  Review
                </Button>
              </Link>
            </div>
          ))}

          {/* 6. Unassigned Phone Line */}
          {unassignedPhones.slice(0, 1).map((phone) => (
            <div
              key={phone.id}
              className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-200/50 dark:border-sky-900/40">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    Phone line unassigned
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {phone.display_number || phone.phone_number} needs agent routing
                  </p>
                </div>
              </div>

              <Link href={`/${orgSlug}/telephony`}>
                <Button size="sm" variant="outline" className="h-7.5 text-xs font-semibold border-sky-300 text-sky-700 dark:text-sky-400 hover:bg-sky-50 px-3 shrink-0">
                  Assign
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
