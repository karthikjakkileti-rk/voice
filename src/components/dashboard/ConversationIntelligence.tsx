'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Bot,
  ArrowRight,
  Sparkles,
  Clock,
  FileText,
  Mic,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Call, Lead } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDuration, formatTimeAgo, formatPhoneNumber } from '@/lib/utils';

interface ConversationIntelligenceProps {
  calls: Call[];
  leads: Lead[];
  orgSlug: string;
}

export function ConversationIntelligence({
  calls,
  leads,
  orgSlug,
}: ConversationIntelligenceProps) {
  return (
    <section aria-label="Conversation Intelligence" className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              CONVERSATION INTELLIGENCE
            </h2>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Interaction Telemetry</span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Post-call synthesized intent, candidate sentiment analysis, counseling outcomes, and transcripts.
          </p>
        </div>

        <Link href={`/${orgSlug}/calls`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5 h-8 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <span>All Conversations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Clean Conversation Intelligence Rows */}
      {calls.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          No candidate conversation sessions recorded yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          {/* Table-style Column Header (Desktop) */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2.5 bg-slate-50/80 dark:bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-3">Student / Caller</div>
            <div className="col-span-2">Agent</div>
            <div className="col-span-2">Intent</div>
            <div className="col-span-1">Sentiment</div>
            <div className="col-span-3">Outcome / Summary</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {calls.slice(0, 5).map((call) => {
            const matchedLead = leads.find(
              (l) => l.source_call_id === call.id || l.phone_number === call.caller_number
            );

            const sentiment = call.sentiment || 'neutral';
            const callerName = call.lead_name || matchedLead?.full_name || formatPhoneNumber(call.caller_number);
            const agentName = call.agent_name || 'Maya';
            const intent = call.call_outcome
              ? call.call_outcome.replace(/_/g, ' ')
              : 'Admissions Inquiry';

            const summaryText =
              (call as any).summary?.summary ||
              (call as any).summary_text ||
              'Prospective candidate counseling session with AI admission counselor.';

            return (
              <Link
                key={call.id}
                href={`/${orgSlug}/calls/${call.id}`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 px-4 py-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors group items-center text-xs"
              >
                {/* 1. Student / Caller */}
                <div className="lg:col-span-3 min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white truncate block group-hover:text-indigo-600 transition-colors">
                    {callerName}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span>{formatPhoneNumber(call.caller_number)}</span>
                    <span>•</span>
                    <span>{formatDuration(call.duration_seconds)}</span>
                  </div>
                </div>

                {/* 2. Agent */}
                <div className="lg:col-span-2 min-w-0">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold truncate block">
                    {agentName}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate block">
                    AI Counselor
                  </span>
                </div>

                {/* 3. Intent */}
                <div className="lg:col-span-2 min-w-0">
                  <span className="inline-block px-2 py-0.2 rounded text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 capitalize truncate max-w-full">
                    {intent}
                  </span>
                </div>

                {/* 4. Sentiment */}
                <div className="lg:col-span-1 min-w-0">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold capitalize ${
                      sentiment === 'positive'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : sentiment === 'negative'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        sentiment === 'positive'
                          ? 'bg-emerald-500'
                          : sentiment === 'negative'
                          ? 'bg-rose-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span>{sentiment}</span>
                  </span>
                </div>

                {/* 5. Outcome / Summary */}
                <div className="lg:col-span-3 min-w-0">
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {summaryText}
                  </p>
                </div>

                {/* 6. Action */}
                <div className="lg:col-span-1 text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
