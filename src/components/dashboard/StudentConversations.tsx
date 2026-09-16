'use client';

import React from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Clock,
  ArrowRight,
  Sparkles,
  PhoneForwarded,
  UserCheck,
  Bot,
  MessageSquare,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Call, Lead } from '@/types/api';
import { formatDuration, formatTimeAgo, formatPhoneNumber } from '@/lib/utils';

interface StudentConversationsProps {
  calls: Call[];
  leads: Lead[];
  orgSlug: string;
  isLoading: boolean;
}

export function StudentConversations({
  calls,
  leads,
  orgSlug,
  isLoading,
}: StudentConversationsProps) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recent Student Conversations
            </h3>
            <Badge variant="primary" size="sm" className="font-mono text-[10px]">
              {calls.length} Logged Sessions
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Detailed call telemetry, intent classification, and conversation transcripts.
          </p>
        </div>

        <Link href={`/${orgSlug}/calls`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1 text-slate-700 dark:text-slate-300"
          >
            <span>All Call Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Conversations List */}
      {isLoading ? (
        <div className="space-y-3 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : calls.length === 0 ? (
        <div className="p-12 text-center text-sm text-slate-500 space-y-2">
          <PhoneCall className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700 dark:text-slate-300">
            No student conversations recorded yet.
          </p>
          <p className="text-xs text-slate-400">
            Incoming candidate calls on your virtual DID line will be logged with full audio transcripts.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {calls.slice(0, 6).map((call) => {
            const matchedLead = leads.find(
              (l) => l.source_call_id === call.id || l.phone_number === call.caller_number
            );

            const isHandoff =
              Boolean(call.transferred_to_human) || call.status === 'transferred';
            const isHighIntent =
              matchedLead?.interest_level === 'high' || call.sentiment === 'positive';

            return (
              <div
                key={call.id}
                className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-950/50 -mx-3 px-3 rounded-2xl transition-colors group"
              >
                {/* Left Column: Caller Identity & Badges */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                    <PhoneCall className="w-4.5 h-4.5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                        {formatPhoneNumber(call.caller_number)}
                      </span>

                      {call.lead_name && (
                        <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                          {call.lead_name}
                        </span>
                      )}

                      {/* Intent / Status Badges */}
                      {isHighIntent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-3xs">
                          <Flame className="w-3 h-3 text-emerald-600 fill-emerald-500" />
                          <span>High Intent</span>
                        </span>
                      )}

                      {isHandoff ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <PhoneForwarded className="w-3 h-3" />
                          <span>Staff Handoff</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Resolved</span>
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          call.sentiment === 'positive'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {call.sentiment || 'neutral'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-normal">
                      Inquiry topic:{' '}
                      <strong className="text-slate-700 dark:text-slate-300 font-medium capitalize">
                        {call.call_outcome?.replace(/_/g, ' ') || 'Admissions & Eligibility'}
                      </strong>
                      {' • '}
                      Handled by Maya{' • '}Duration: {formatDuration(call.duration_seconds)}
                    </p>
                  </div>
                </div>

                {/* Right Column: Timing & Direct Transcript Link */}
                <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-1 lg:pt-0">
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimeAgo(call.started_at || call.created_at)}</span>
                  </div>

                  <Link href={`/${orgSlug}/calls/${call.id}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs gap-1.5"
                    >
                      <span>Read Transcript</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
