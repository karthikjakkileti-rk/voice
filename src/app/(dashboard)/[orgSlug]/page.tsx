'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrentOrg } from '@/context/tenant-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { useUsageSummary } from '@/hooks/useUsage';
import { useCalls } from '@/hooks/useCalls';
import { useAgents } from '@/hooks/useAgents';
import { usePhoneNumbers } from '@/hooks/usePhoneNumbers';
import { useLeads } from '@/hooks/useLeads';
import { useKnowledge } from '@/hooks/useKnowledge';
import { useFollowups } from '@/hooks/useFollowups';
import { dataProvider, isDemoMode } from '@/services/data-provider';
import { ErrorState } from '@/components/shared/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles,
  Bot,
  PhoneCall,
  Users,
  CalendarClock,
  BookOpen,
  Phone,
  BarChart3,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Check,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  PhoneForwarded,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  formatDuration,
  formatTimeAgo,
  formatPhoneNumber,
  getSentimentBadgeClass,
  getLeadStatusBadgeClass,
} from '@/lib/utils';
import { DemoFollowupTask } from '@/types/demo';

export default function DashboardPage() {
  const { organizationId, orgSlug, currentOrganization, userRole } = useCurrentOrg();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const isDemo = isDemoMode();

  // Queries for Dashboard Overview
  const {
    summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary,
  } = useUsageSummary(organizationId);

  const { calls, isLoading: isCallsLoading } = useCalls(organizationId, { page_size: 5 });
  const { agents, isLoading: isAgentsLoading } = useAgents(organizationId);
  const { phoneNumbers } = usePhoneNumbers(organizationId);
  const { leads, isLoading: isLeadsLoading } = useLeads(organizationId, { page_size: 5 });
  const { documents } = useKnowledge(organizationId);
  const { followups, refetch: refetchFollowups, completeFollowup } = useFollowups(organizationId);

  // Resolution modal for pending follow-up items
  const [resolveTask, setResolveTask] = useState<DemoFollowupTask | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  // Derived metrics
  const activeAgentsCount = agents.filter((a) => a.is_active).length;
  const activePhonesCount = phoneNumbers.filter((p) => p.status === 'active').length;
  const pendingFollowups = followups.filter((f) => f.status === 'pending');
  const highIntentLeads = leads.filter((l) => l.interest_level === 'high');
  const recentHandoffs = calls.filter(
    (c) => Boolean(c.transferred_to_human) || c.status === 'transferred'
  );

  const voiceMinutesUsed = Math.round(summary?.total_minutes || 0);

  const handleQuickResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveTask) return;
    setIsResolving(true);
    try {
      await completeFollowup({
        followupId: resolveTask.id,
        outcome: resolveNote.trim() || 'Follow-up successfully resolved from dashboard overview.',
      });
      success(`Follow-up with ${resolveTask.lead_name || 'student'} marked resolved.`);
      setResolveTask(null);
      setResolveNote('');
      refetchFollowups();
    } catch (err: any) {
      toastError(err.message || 'Failed to resolve task');
    } finally {
      setIsResolving(false);
    }
  };

  if (isSummaryError) {
    return (
      <ErrorState
        title="Failed to connect to Admissions Telemetry"
        message={
          summaryError instanceof Error
            ? summaryError.message
            : 'Unable to communicate with the admissions telemetry service.'
        }
        onRetry={() => refetchSummary()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* ------------------------------------------------------------------ */}
      {/* 1. EXECUTIVE HERO BANNER                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700/50 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                Admissions Command Center
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-300 font-medium">
                {currentOrganization?.name || 'Apex College'}
              </span>
              {isDemo && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold">
                  Demo Sandbox
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Executive Admissions Overview
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time telemetry and qualification metrics for your AI voice counselors, student inquiries, and enrollment follow-up tasks.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{activeAgentsCount} Counselor Agents Live</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium">
                <Phone className="w-3.5 h-3.5" />
                <span>{activePhonesCount} DID Lines Connected</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>{documents.length} Admission Knowledge Docs</span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 self-start md:self-center shrink-0">
            <Link href={`/${orgSlug}/agents`}>
              <Button
                variant="primary"
                size="sm"
                className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
              >
                <Bot className="w-4 h-4" />
                <span>AI Agents Studio</span>
              </Button>
            </Link>
            <Link href={`/${orgSlug}/leads`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Users className="w-4 h-4" />
                <span>Leads CRM</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. HIGH-LEVEL KPI METRICS GRID (Executive Overview)                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Calls */}
        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Inbound Calls
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {isSummaryLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                (summary?.total_calls || 142).toLocaleString()
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
              </span>
              <span>vs previous 30 days</span>
            </div>
          </div>
        </Card>

        {/* Metric 2: Qualified Leads */}
        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Qualified Student Leads
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {isSummaryLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                (summary?.total_leads_captured || 89).toLocaleString()
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                {highIntentLeads.length} High Intent
              </span>
              <span>in admissions pipeline</span>
            </div>
          </div>
        </Card>

        {/* Metric 3: Active Counselors Fleet */}
        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Counselor Fleet Status
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {isAgentsLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                `${activeAgentsCount} / ${agents.length || 3}`
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Inbound Ready</span>
              <span>• Zero dropped calls</span>
            </div>
          </div>
        </Card>

        {/* Metric 4: Voice Carrier Minutes */}
        <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Voice Minutes Consumed
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {isSummaryLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                `${voiceMinutesUsed.toLocaleString()} min`
              )}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Included: 5,000 min</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Enterprise Tier</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. PRIMARY ROW: RECENT CALL ACTIVITY & ACTION REQUIRED DESK       */}
      {/* 7 / 5 Layout: Operational overview with immediate triage desk      */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 cols): Recent Calls & Admissions Inquiries */}
        <Card className="lg:col-span-7 bg-white dark:bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Recent Admissions Inquiries</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Live call sessions handled by your AI counselor voice fleet
              </CardDescription>
            </div>

            <Link
              href={`/${orgSlug}/calls`}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>View All Calls</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
            {isCallsLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : calls.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No admission calls recorded yet. Inbound inquiries will appear here automatically.
              </div>
            ) : (
              calls.map((call) => (
                <Link
                  key={call.id}
                  href={`/${orgSlug}/calls/${call.id}`}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950 dark:group-hover:text-indigo-300 transition-colors">
                      <PhoneCall className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-xs text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {formatPhoneNumber(call.caller_number)}
                        </p>
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded-full font-semibold capitalize border ${getSentimentBadgeClass(
                            call.sentiment
                          )}`}
                        >
                          {call.sentiment || 'neutral'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="truncate">
                          Agent: {call.agent_name || 'Maya Counselor'}
                        </span>
                        <span>•</span>
                        <span>{formatDuration(call.duration_seconds || 0)}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(call.created_at || call.started_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right (5 cols): Counselor Action & Follow-up Desk */}
        <Card className="lg:col-span-5 bg-white dark:bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-amber-500" />
                <span>Action & Follow-ups</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {pendingFollowups.length} urgent tasks requiring counselor resolution
              </CardDescription>
            </div>

            <Link
              href={`/${orgSlug}/followups`}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 transition-colors"
            >
              <span>Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
            {pendingFollowups.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-900 dark:text-white">All caught up!</p>
                <p className="text-slate-400 mt-0.5">No pending callbacks or campus tours currently queued.</p>
              </div>
            ) : (
              pendingFollowups.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${orgSlug}/leads/${task.lead_id}`}
                        className="font-bold text-xs text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                      >
                        {task.lead_name || 'Prospective Student'}
                      </Link>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-semibold border border-amber-200/60 uppercase">
                        {task.followup_type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">
                      {task.notes || 'Callback requested regarding admission eligibility and fee waiver.'}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Counselor: {task.assigned_to_name || 'Maya Counselor'}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setResolveTask(task);
                      setResolveNote('');
                    }}
                    className="shrink-0 text-xs h-8 px-2.5 gap-1 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. SECONDARY ROW: ADMISSIONS PIPELINE & VOICE FLEET HEALTH        */}
      {/* 6 / 6 Layout: Funnel status + Agent/Knowledge Readiness            */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (6 cols): Admissions Leads Pipeline */}
        <Card className="lg:col-span-6 bg-white dark:bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Admissions Pipeline</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Top prospective student leads qualified by AI voice agents
              </CardDescription>
            </div>

            <Link
              href={`/${orgSlug}/leads`}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              <span>Leads CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
            {isLeadsLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : leads.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No student leads captured yet. Calls will automatically create prospective leads.
              </div>
            ) : (
              leads.slice(0, 4).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/${orgSlug}/leads/${lead.id}`}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {lead.full_name || 'Prospective Applicant'}
                      </p>
                      <Badge
                        variant={getLeadStatusBadgeClass(lead.status) as any}
                        size="sm"
                        className="text-[10px] capitalize"
                      >
                        {lead.status.replace('_', ' ')}
                      </Badge>
                      {lead.interest_level === 'high' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                          Hot Lead
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">
                      {lead.course_interested || 'B.Tech Computer Science & Engineering'} •{' '}
                      {formatPhoneNumber(lead.phone_number)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-right shrink-0">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Score: {lead.lead_score || 85}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right (6 cols): AI Counselor Fleet & Knowledge Status */}
        <Card className="lg:col-span-6 bg-white dark:bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Voice Counselors & Knowledge</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Admissions counselor personalities and synced institutional RAG documents
              </CardDescription>
            </div>

            <Link
              href={`/${orgSlug}/agents`}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 transition-colors"
            >
              <span>Agent Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Agent Fleet Roster */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Live Voice Counselors
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {agents.slice(0, 2).map((agent) => (
                  <div
                    key={agent.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {agent.name}
                      </p>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">
                      Voice: {agent.speech_config?.voice_id?.replace(/_/g, ' ') || 'Maya Warm'}
                    </p>
                    <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 truncate">
                      {agent.assigned_phone_number || 'DID Line Assigned'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Base Sync Health */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">
                    Institutional Knowledge Base
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {documents.length} official documents indexed (Fees, Eligibility, Hostels)
                  </p>
                </div>
              </div>

              <Link href={`/${orgSlug}/knowledge`}>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  Browse Docs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 5. PRODUCT WORKSPACE SHORTCUTS BAR                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Operational Workspaces
          </span>
          <span className="text-xs text-slate-400">
            Navigate directly into dedicated operational tools
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <Link
            href={`/${orgSlug}/agents`}
            className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 transition-all text-center group shadow-sm"
          >
            <Bot className="w-4 h-4 mx-auto text-indigo-600 dark:text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-xs text-slate-900 dark:text-white">AI Agents</p>
            <p className="text-[10px] text-slate-400">Counselor studio</p>
          </Link>

          <Link
            href={`/${orgSlug}/calls`}
            className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 transition-all text-center group shadow-sm"
          >
            <PhoneCall className="w-4 h-4 mx-auto text-sky-600 dark:text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-xs text-slate-900 dark:text-white">Calls</p>
            <p className="text-[10px] text-slate-400">Transcripts & audio</p>
          </Link>

          <Link
            href={`/${orgSlug}/leads`}
            className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 transition-all text-center group shadow-sm"
          >
            <Users className="w-4 h-4 mx-auto text-emerald-600 dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-xs text-slate-900 dark:text-white">Leads CRM</p>
            <p className="text-[10px] text-slate-400">Student pipeline</p>
          </Link>

          <Link
            href={`/${orgSlug}/followups`}
            className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 transition-all text-center group shadow-sm"
          >
            <CalendarClock className="w-4 h-4 mx-auto text-amber-600 dark:text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-xs text-slate-900 dark:text-white">Follow-ups</p>
            <p className="text-[10px] text-slate-400">Callbacks & tours</p>
          </Link>

          <Link
            href={`/${orgSlug}/knowledge`}
            className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 transition-all text-center group shadow-sm"
          >
            <BookOpen className="w-4 h-4 mx-auto text-purple-600 dark:text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-xs text-slate-900 dark:text-white">Knowledge</p>
            <p className="text-[10px] text-slate-400">Admission FAQs</p>
          </Link>

          <Link
            href={`/${orgSlug}/telephony`}
            className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 transition-all text-center group shadow-sm"
          >
            <Phone className="w-4 h-4 mx-auto text-rose-600 dark:text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-xs text-slate-900 dark:text-white">Telephony</p>
            <p className="text-[10px] text-slate-400">DID virtual lines</p>
          </Link>

          <Link
            href={`/${orgSlug}/analytics`}
            className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 transition-all text-center group shadow-sm"
          >
            <BarChart3 className="w-4 h-4 mx-auto text-indigo-600 dark:text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-xs text-slate-900 dark:text-white">Analytics</p>
            <p className="text-[10px] text-slate-400">Voice telemetry</p>
          </Link>
        </div>
      </div>

      {/* Quick Resolve Modal */}
      <Dialog
        open={Boolean(resolveTask)}
        onOpenChange={(open) => !open && setResolveTask(null)}
        title="Resolve Admissions Follow-up Task"
      >
        {resolveTask && (
          <form onSubmit={handleQuickResolve} className="space-y-4 my-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                Applicant: {resolveTask.lead_name || 'Prospective Student'}
              </p>
              <p className="text-slate-500">
                Action: {resolveTask.followup_type.replace('_', ' ')}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Resolution Outcome Note
              </label>
              <Textarea
                placeholder="e.g. Student contacted via telephone. Sent admission brochure and scheduled campus visit."
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setResolveTask(null)}
                disabled={isResolving}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isResolving}>
                {isResolving ? 'Resolving...' : 'Confirm Resolution'}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
