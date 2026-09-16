'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  PhoneForwarded,
  Clock,
  ArrowRight,
  Eye,
  CheckCircle2,
  Flame,
  Activity,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Call, Lead } from '@/types/api';
import { formatDuration, formatTimeAgo, formatPhoneNumber } from '@/lib/utils';

interface LiveAdmissionsActivityProps {
  calls: Call[];
  leads: Lead[];
  orgSlug: string;
  activeAgentName?: string;
}

export function LiveAdmissionsActivity({
  calls,
  leads,
  orgSlug,
  activeAgentName = 'AI Counselor',
}: LiveAdmissionsActivityProps) {
  const [filterType, setFilterType] = useState<'all' | 'resolved' | 'handoff' | 'high_intent'>('all');

  // Derive genuine events from returned calls and leads
  const events = calls.map((call) => {
    const matchedLead = leads.find(
      (l) => l.source_call_id === call.id || l.phone_number === call.caller_number
    );

    const isHandoff =
      Boolean(call.transferred_to_human) || call.status === 'transferred';
    const isHighIntent =
      matchedLead?.interest_level === 'high' || call.sentiment === 'positive';
    const isCompleted = !isHandoff && call.status === 'completed';

    const counselor = call.agent_name || activeAgentName;

    let eventType: 'resolved' | 'handoff' | 'high_intent' | 'general' = 'general';
    let title = 'Inbound Candidate Call Handled';
    let subtitle = `Voice session handled by ${counselor} (${formatDuration(call.duration_seconds)})`;

    if (isHandoff) {
      eventType = 'handoff';
      title = 'Escalated to Staff Counselor';
      subtitle = call.handoff_reason || 'Candidate transferred for senior staff counseling';
    } else if (isHighIntent) {
      eventType = 'high_intent';
      title = 'High-Intent Candidate Identified';
      subtitle = matchedLead?.course_interested
        ? `Interested in ${matchedLead.course_interested}`
        : 'Candidate expressed strong enrollment interest';
    } else if (isCompleted) {
      eventType = 'resolved';
      title = 'Autonomous Call Completed';
      subtitle = call.call_outcome
        ? `Outcome: ${call.call_outcome.replace(/_/g, ' ')}`
        : `Answered candidate inquiries (${formatDuration(call.duration_seconds)})`;
    }

    return {
      id: call.id,
      callId: call.id,
      callerNumber: call.caller_number,
      leadName: call.lead_name || matchedLead?.full_name,
      time: call.started_at || call.created_at,
      duration: call.duration_seconds,
      outcome: call.call_outcome,
      sentiment: call.sentiment,
      counselor,
      eventType,
      title,
      subtitle,
      isHandoff,
      isHighIntent,
      isCompleted,
    };
  });

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    if (filterType === 'resolved') return e.isCompleted;
    if (filterType === 'handoff') return e.isHandoff;
    if (filterType === 'high_intent') return e.isHighIntent;
    return true;
  });

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-5">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recent Admissions Activity
            </h3>
            <Badge variant="primary" size="sm" className="font-mono text-[10px]">
              {events.length} Records
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Latest candidate inquiry sessions, completed calls, and staff escalations.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType('high_intent')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              filterType === 'high_intent'
                ? 'bg-emerald-500 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            High Intent
          </button>
          <button
            type="button"
            onClick={() => setFilterType('handoff')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              filterType === 'handoff'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Handoffs
          </button>
          <button
            type="button"
            onClick={() => setFilterType('resolved')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              filterType === 'resolved'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Activity Timeline List */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center space-y-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            No recent activity
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When candidates dial your admissions line, call logs and qualification events will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.slice(0, 5).map((event) => {
            const isHandoff = event.isHandoff;
            const isHighIntent = event.isHighIntent;

            return (
              <div
                key={event.id}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-2xs"
              >
                {/* Event Details */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                      isHandoff
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : isHighIntent
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    {isHandoff ? (
                      <PhoneForwarded className="w-5 h-5" />
                    ) : isHighIntent ? (
                      <Flame className="w-5 h-5 fill-current" />
                    ) : (
                      <PhoneCall className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {event.title}
                      </span>
                      {isHighIntent && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          High Intent
                        </span>
                      )}
                      {isHandoff && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          Staff Escalation
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {event.subtitle}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span className="font-mono">{formatPhoneNumber(event.callerNumber)}</span>
                      {event.leadName && <span>• {event.leadName}</span>}
                      <span>• Duration: {formatDuration(event.duration)}</span>
                      <span>• {formatTimeAgo(event.time)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <Link href={`/${orgSlug}/calls/${event.callId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs font-bold gap-1 text-slate-700 dark:text-slate-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Call</span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View All Calls Link */}
      <div className="pt-2 text-center">
        <Link
          href={`/${orgSlug}/calls`}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
        >
          <span>View complete telephony interactions table</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
