'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCurrentOrg } from '@/context/tenant-context';
import { useCall } from '@/hooks/useCalls';
import { useAuth } from '@/context/auth-context';
import {
  ArrowLeft,
  PhoneCall,
  User,
  Bot,
  Sparkles,
  Clock,
  PhoneForwarded,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { AudioPlayerWaveform } from '@/components/audio/AudioPlayerWaveform';
import { TranscriptViewer } from '@/components/calls/TranscriptViewer';
import {
  formatDuration,
  formatDateTime,
  getSentimentBadgeClass,
  formatPhoneNumber,
} from '@/lib/utils';

export default function CallDetailPage() {
  const params = useParams();
  const { organizationId, orgSlug } = useCurrentOrg();
  const { demoMode } = useAuth();
  const callId = (params?.callId as string) || '';

  const { call, isLoading, isError, error, refetch } = useCall(organizationId, callId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !call) {
    return (
      <ErrorState
        title="Call Session Not Found"
        message={error instanceof Error ? error.message : `Call with ID '${callId}' not found.`}
        onRetry={() => refetch()}
      />
    );
  }

  const turns = call.transcripts || call.turns || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <Link href={`/${orgSlug}/calls`}>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Call Session with {formatPhoneNumber(call.caller_number)}
            </h1>
            <span className={`text-xs px-2.5 py-0.5 rounded-lg border font-semibold capitalize ${getSentimentBadgeClass(call.sentiment)}`}>
              {call.sentiment || 'neutral'} sentiment
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Call ID: <span className="font-mono text-slate-700 dark:text-slate-300">{call.id}</span> • Started: {formatDateTime(call.started_at || call.created_at)}
          </p>
        </div>
      </div>

      {/* Audio Playback Waveform */}
      <AudioPlayerWaveform
        recordingUrl={call.recording_url}
        durationSeconds={call.duration_seconds}
        callerName={`Inquiry Audio — ${formatPhoneNumber(call.caller_number)}`}
        isDemo={demoMode}
      />

      {/* Main Content Grid: Transcripts & AI Post-Call Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Turn-by-Turn Transcript Viewer */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-base">Conversational Dialogue Transcript</CardTitle>
              <CardDescription>Turn-by-turn dialogue synchronization between AI counselor and student.</CardDescription>
            </div>
            <Badge variant="primary" size="sm">
              {turns.length} Turns Recorded
            </Badge>
          </div>

          <TranscriptViewer
            transcripts={turns}
            agentName={call.agent_name || 'Maya — Counselor'}
            callerNumber={call.lead_name || formatPhoneNumber(call.caller_number)}
          />
        </Card>

        {/* Right Sidebar: AI Summary & Call Metadata */}
        <div className="space-y-6">
          {/* Post-Call Intelligence Summary */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <CardTitle className="text-base">AI Synthesis & Summary</CardTitle>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {call.summary?.summary || call.summary_text || 'Post-call AI synthesis processing complete.'}
            </p>

            {/* Key Topics */}
            {call.summary?.key_topics && call.summary.key_topics.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Key Topics Inquired:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {call.summary.key_topics.map((topic, i) => (
                    <Badge key={i} variant="neutral" size="sm">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {call.summary?.action_items && call.summary.action_items.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Recommended Next Actions:
                </span>
                <div className="space-y-1.5">
                  {call.summary.action_items.map((action, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Call Metadata Details */}
          <Card className="p-6 space-y-3 text-xs">
            <CardTitle className="text-sm font-bold pb-2 border-b border-slate-100 dark:border-slate-800">
              Session Metadata
            </CardTitle>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Call Duration:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatDuration(call.duration_seconds)}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Call Outcome:</span>
              <span className="font-semibold text-slate-900 dark:text-white capitalize">
                {call.call_outcome?.replace(/_/g, ' ') || 'General Inquiry'}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Assigned Lead:</span>
              {call.lead_name ? (
                <Link
                  href={`/${orgSlug}/leads/${call.lead_id || ''}`}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {call.lead_name}
                </Link>
              ) : (
                <span className="text-slate-400">Unlinked</span>
              )}
            </div>

            {/* Human Handoff info */}
            {call.transferred_to_human && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-1 mt-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-xs">
                  <PhoneForwarded className="w-3.5 h-3.5" />
                  <span>Human Transfer Executed</span>
                </div>
                {call.transferred_to_phone && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    Transferred to: <span className="font-mono font-bold">{call.transferred_to_phone}</span>
                  </p>
                )}
                {call.handoff_reason && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400/90 italic">
                    &ldquo;{call.handoff_reason}&rdquo;
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
