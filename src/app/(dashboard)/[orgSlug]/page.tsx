'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { isDemoMode } from '@/services/data-provider';
import { ErrorState } from '@/components/shared/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Bot,
  Users,
  CalendarClock,
  BookOpen,
  Phone,
  BarChart3,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  User,
  ArrowUpRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  formatDuration,
  formatDateTime,
  formatPhoneNumber,
  getSentimentBadgeClass,
  getLeadStatusBadgeClass,
} from '@/lib/utils';
import { DemoFollowupTask } from '@/types/demo';
import { CallStatus, CallDirection, CallOutcome } from '@/types/api';

export default function OperationsConsoleDashboard() {
  const { organizationId, orgSlug, currentOrganization, userRole } = useCurrentOrg();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const router = useRouter();
  const isDemo = isDemoMode();

  // Communication Console Filter State
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');

  // Listen to global header search event
  useEffect(() => {
    const handleGlobalSearch = (e: any) => {
      setSearchQuery(e.detail || '');
      setPage(1);
    };
    window.addEventListener('eduvoice:search', handleGlobalSearch);
    return () => window.removeEventListener('eduvoice:search', handleGlobalSearch);
  }, []);

  // Backend Data Hooks
  const {
    summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary,
  } = useUsageSummary(organizationId);

  const {
    calls,
    meta: callsMeta,
    isLoading: isCallsLoading,
    isError: isCallsError,
    error: callsError,
    refetch: refetchCalls,
  } = useCalls(organizationId, {
    page,
    page_size: 15,
    search: searchQuery,
    status: statusFilter,
    direction: directionFilter,
    agent_id: agentFilter,
  });

  const { agents, isLoading: isAgentsLoading } = useAgents(organizationId);
  const { phoneNumbers, isLoading: isPhonesLoading } = usePhoneNumbers(organizationId);
  const { leads, isLoading: isLeadsLoading } = useLeads(organizationId, { page_size: 6 });
  const { documents, isLoading: isKnowledgeLoading } = useKnowledge(organizationId);
  const { followups, isLoading: isFollowupsLoading, refetch: refetchFollowups, completeFollowup } =
    useFollowups(organizationId);

  // Quick Resolve modal state for follow-ups in Action Required
  const [resolveTask, setResolveTask] = useState<DemoFollowupTask | null>(null);
  const [resolveOutcome, setResolveOutcome] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  // Operational System Readiness
  const activeAgents = agents.filter((a) => a.is_active);
  const activePhones = phoneNumbers.filter((p) => p.status === 'active');
  const isSystemOperational = activeAgents.length > 0 && activePhones.length > 0;

  // Real Action Required Signals
  const pendingFollowups = followups.filter((f) => f.status === 'pending');
  const transferredCalls = calls.filter((c) => Boolean(c.transferred_to_human) || c.status === 'transferred');
  const inactiveAgents = agents.filter((a) => !a.is_active);
  const unassignedPhones = phoneNumbers.filter((p) => !p.assigned_agent && !p.assignment);
  const failedDocs = documents.filter((d) => d.status === 'failed');

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    directionFilter !== 'all' ||
    agentFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDirectionFilter('all');
    setAgentFilter('all');
    setPage(1);
  };

  const handleConfirmResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveTask) return;
    setIsResolving(true);
    try {
      await completeFollowup({
        followupId: resolveTask.id,
        outcome: resolveOutcome.trim() || 'Follow-up task resolved by counselor from operations console.',
      });
      success(`Follow-up with ${resolveTask.lead_name || 'applicant'} completed.`);
      setResolveTask(null);
      setResolveOutcome('');
      refetchFollowups();
    } catch (err: any) {
      toastError(err.message || 'Failed to resolve task');
    } finally {
      setIsResolving(false);
    }
  };

  const getCallStatusBadge = (status?: string | null) => {
    const s = (status || 'completed').toLowerCase();
    switch (s) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case 'transferred':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Transferred
          </span>
        );
      case 'in_progress':
      case 'ringing':
      case 'initiated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            In Progress
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Failed
          </span>
        );
      case 'no_answer':
      case 'busy':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {s === 'busy' ? 'Busy' : 'No Answer'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const formatOutcome = (outcome?: string | null, hasLead?: boolean) => {
    if (hasLead) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded font-medium text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300">
          Lead Created
        </span>
      );
    }
    if (!outcome) return <span className="text-slate-400">—</span>;
    switch (outcome) {
      case 'admission_inquiry':
        return <span className="text-slate-700 dark:text-slate-300 font-medium">Admission Inquiry</span>;
      case 'campus_visit_scheduled':
        return <span className="text-indigo-700 dark:text-indigo-300 font-medium">Campus Visit</span>;
      case 'fee_query':
        return <span className="text-slate-700 dark:text-slate-300 font-medium">Fee Query</span>;
      case 'general_inquiry':
        return <span className="text-slate-600 dark:text-slate-400">General Inquiry</span>;
      case 'dropped':
        return <span className="text-slate-500">Dropped</span>;
      default:
        return <span className="text-slate-600 capitalize">{outcome.replace(/_/g, ' ')}</span>;
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
    <div className="space-y-4 animate-in fade-in duration-200 pb-12 select-none">
      {/* ================================================================== */}
      {/* SECTION 1 — OPERATIONS HEADER                                      */}
      {/* ================================================================== */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Institution + Console Tag + Real Status */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
                {currentOrganization?.name || 'Apex College'}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                AI Communication Operations Console
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Live Operations Center
              </h1>

              {isSystemOperational ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>SYSTEM OPERATIONAL</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>ATTENTION: {activeAgents.length === 0 ? 'NO ACTIVE AGENTS' : 'CHECK PHONE LINES'}</span>
                </div>
              )}

              {isDemo && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700">
                  Demo Data Mode
                </span>
              )}
            </div>
          </div>

          {/* Compact High-Value All-Time Summary Ribbon (Exotel-inspired dense metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-3 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 shrink-0">
            {/* Total Calls */}
            <div className="px-2.5 py-1 min-w-[110px]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Calls
              </span>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                {isSummaryLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  (summary?.total_calls ?? callsMeta.total ?? 0).toLocaleString()
                )}
              </p>
              <span className="text-[9px] text-slate-400 font-medium block">All-time scope</span>
            </div>

            {/* Total Voice Minutes */}
            <div className="px-2.5 py-1 min-w-[110px] border-l border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Voice Minutes
              </span>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                {isSummaryLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  (summary?.total_minutes ?? 0).toLocaleString()
                )}
              </p>
              <span className="text-[9px] text-slate-400 font-medium block">All-time scope</span>
            </div>

            {/* Leads Captured */}
            <div className="px-2.5 py-1 min-w-[110px] border-l border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Leads Captured
              </span>
              <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 leading-tight mt-0.5">
                {isSummaryLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  (summary?.total_leads_captured ?? 0).toLocaleString()
                )}
              </p>
              <span className="text-[9px] text-slate-400 font-medium block">All-time scope</span>
            </div>

            {/* Staff Transfers */}
            <div className="px-2.5 py-1 min-w-[110px] border-l border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Staff Transfers
              </span>
              <p className="text-lg font-black text-indigo-700 dark:text-indigo-400 leading-tight mt-0.5">
                {isSummaryLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  (summary?.human_handoff_count ?? 0).toLocaleString()
                )}
              </p>
              <span className="text-[9px] text-slate-400 font-medium block">All-time scope</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* MAIN TWO-COLUMN SPLIT: COMMUNICATION CONSOLE (LEFT) + DESK (RIGHT) */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ================================================================ */}
        {/* SECTION 2 & 3: PRIMARY COMMUNICATION CONSOLE (CALL HISTORY)       */}
        {/* ================================================================ */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-3 min-w-0">
          <Card className="bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Console Header */}
            <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Call & Conversation History
                </h2>
                <span className="text-[11px] font-medium text-slate-500">
                  ({callsMeta.total} records total)
                </span>
              </div>

              <Link
                href={`/${orgSlug}/calls`}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>Full Call Intelligence Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* SECTION 3 — SEARCH + FILTER TOOLBAR */}
            <div className="p-3 border-b border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search caller phone, lead, or agent name..."
                    className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Direction Filter */}
                  <select
                    value={directionFilter}
                    onChange={(e) => {
                      setDirectionFilter(e.target.value);
                      setPage(1);
                    }}
                    aria-label="Filter by Direction"
                    className="h-8 px-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">Direction: All</option>
                    <option value="inbound">Inbound (Incoming)</option>
                    <option value="outbound">Outbound (Outgoing)</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    aria-label="Filter by Status"
                    className="h-8 px-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">Status: All</option>
                    <option value="completed">Completed</option>
                    <option value="transferred">Transferred</option>
                    <option value="in_progress">In Progress</option>
                    <option value="failed">Failed</option>
                    <option value="no_answer">No Answer</option>
                    <option value="busy">Busy</option>
                  </select>

                  {/* Agent Filter */}
                  <select
                    value={agentFilter}
                    onChange={(e) => {
                      setAgentFilter(e.target.value);
                      setPage(1);
                    }}
                    aria-label="Filter by Agent"
                    className="h-8 px-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">Agent: All</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name}
                      </option>
                    ))}
                  </select>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="h-8 px-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* DENSE DATA TABLE (EXOTEL-STYLE) */}
            <div className="overflow-x-auto">
              {isCallsLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded" />
                  ))}
                </div>
              ) : calls.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <PhoneCall className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="font-semibold text-slate-900 dark:text-white">No communications matched filters</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Adjust search query or filter parameters to view records.
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-3 text-xs">
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Caller</th>
                      <th className="py-2.5 px-3">Agent</th>
                      <th className="py-2.5 px-3">Direction</th>
                      <th className="py-2.5 px-3">Date / Time</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Intent</th>
                      <th className="py-2.5 px-3">Outcome</th>
                      <th className="py-2.5 px-3">Handoff</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {calls.map((call) => {
                      const isIncoming = call.direction !== 'outbound';
                      const isHandoff = Boolean(call.transferred_to_human) || call.status === 'transferred';
                      const hasLead = Boolean(call.lead_id);

                      return (
                        <tr
                          key={call.id}
                          onClick={() => router.push(`/${orgSlug}/calls/${call.id}`)}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                        >
                          {/* Caller */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-semibold text-slate-900 dark:text-white font-mono group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {formatPhoneNumber(call.caller_number)}
                            </div>
                            {call.lead_name && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[130px]">
                                <User className="w-2.5 h-2.5 text-slate-400" />
                                <span>{call.lead_name}</span>
                              </div>
                            )}
                          </td>

                          {/* Agent */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                              <Bot className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span className="truncate max-w-[110px]">
                                {call.agent_name || 'Maya Counselor'}
                              </span>
                            </div>
                          </td>

                          {/* Direction */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                              {isIncoming ? (
                                <>
                                  <PhoneIncoming className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Incoming</span>
                                </>
                              ) : (
                                <>
                                  <PhoneOutgoing className="w-3.5 h-3.5 text-sky-500" />
                                  <span>Outgoing</span>
                                </>
                              )}
                            </span>
                          </td>

                          {/* Date / Time */}
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-[11px]">
                            {formatDateTime(call.created_at || call.started_at)}
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {getCallStatusBadge(call.status || call.call_status)}
                          </td>

                          {/* Intent */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {call.sentiment ? (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded border capitalize font-semibold ${getSentimentBadgeClass(
                                  call.sentiment
                                )}`}
                              >
                                {call.sentiment}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Inquiry</span>
                            )}
                          </td>

                          {/* Outcome */}
                          <td className="py-2.5 px-3 whitespace-nowrap text-[11px]">
                            {formatOutcome(call.call_outcome, hasLead)}
                          </td>

                          {/* Handoff */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {isHandoff ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300">
                                Transferred
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">AI Handled</span>
                            )}
                          </td>

                          {/* Duration */}
                          <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                            {formatDuration(call.duration_seconds || 0)}
                          </td>

                          {/* Action */}
                          <td className="py-2.5 px-3 whitespace-nowrap text-right">
                            <Link
                              href={`/${orgSlug}/calls/${call.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200/60 dark:border-slate-700 transition-colors"
                            >
                              <span>View</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination & Console Scope Footer */}
            <div className="px-4 py-2.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-950/30">
              <span className="text-[11px] text-slate-500">
                Showing {calls.length} of {callsMeta.total} records • Page {page} of {callsMeta.total_pages || 1}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-7 px-2 text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
                  <span>Prev</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= (callsMeta.total_pages || 1)}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-7 px-2 text-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================================ */}
        {/* RIGHT COLUMN: ACTION REQUIRED + AI FLEET + TELEPHONY STRIP        */}
        {/* ================================================================ */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          {/* SECTION 11 — ACTION REQUIRED (TRIAGE CENTER) */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
            <CardHeader className="py-2.5 px-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-amber-50/40 dark:bg-amber-950/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Action Required
                </CardTitle>
              </div>
              <Badge variant="warning" size="sm" className="text-[10px] font-bold">
                {pendingFollowups.length + transferredCalls.length} Items
              </Badge>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[380px] overflow-y-auto custom-scrollbar">
              {pendingFollowups.length === 0 && transferredCalls.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                  <p className="font-semibold text-slate-900 dark:text-white">All queues cleared</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">No urgent counselor callbacks or transfers.</p>
                </div>
              ) : (
                <>
                  {/* Urgent Follow-ups */}
                  {pendingFollowups.slice(0, 3).map((f) => (
                    <div key={f.id} className="p-3 space-y-1.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {f.lead_name || 'Prospective Student'}
                        </span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {f.followup_type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {f.notes || 'Counselor callback regarding admission fee and eligibility.'}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTime(f.scheduled_at)}</span>
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setResolveTask(f);
                            setResolveOutcome('');
                          }}
                          className="h-6 px-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border-emerald-200 hover:bg-emerald-50"
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Transferred Calls Needing Review */}
                  {transferredCalls.slice(0, 2).map((c) => (
                    <div key={c.id} className="p-3 space-y-1.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                          {formatPhoneNumber(c.caller_number)}
                        </span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          Human Handoff
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        Transferred to counselor • {formatDuration(c.duration_seconds)}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">
                          {formatDateTime(c.created_at)}
                        </span>
                        <Link href={`/${orgSlug}/calls/${c.id}`}>
                          <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] font-bold">
                            Review Call
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* SECTION 6 — AI TEAM STRIP (COMPACT AGENT CARDS) */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
            <CardHeader className="py-2.5 px-3.5 border-b border-slate-200/80 dark:border-slate-800 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  AI Counselors ({agents.length})
                </CardTitle>
              </div>
              <Link
                href={`/${orgSlug}/agents`}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Studio</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>

            <CardContent className="p-3 space-y-2.5">
              {isAgentsLoading ? (
                <Skeleton className="h-20 w-full rounded" />
              ) : agents.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-4">No AI agents configured yet.</div>
              ) : (
                agents.slice(0, 3).map((agent) => (
                  <div
                    key={agent.id}
                    className="p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {agent.name}
                        </p>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${agent.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {agent.speech_config?.voice_id?.replace(/_/g, ' ') || 'Maya Warm'} •{' '}
                        {agent.speech_config?.primary_language || 'en-IN'}
                      </p>
                      <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 truncate">
                        Line: {agent.assigned_phone_number || '040-459-01132'}
                      </p>
                    </div>

                    <Link href={`/${orgSlug}/agents/${agent.id}/config`}>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] font-semibold shrink-0">
                        Configure
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* SECTION 10 — TELEPHONY PANEL */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
            <CardHeader className="py-2.5 px-3.5 border-b border-slate-200/80 dark:border-slate-800 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Telephony Lines ({phoneNumbers.length})
                </CardTitle>
              </div>
              <Link
                href={`/${orgSlug}/telephony`}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>

            <CardContent className="p-3 space-y-2">
              {isPhonesLoading ? (
                <Skeleton className="h-16 w-full rounded" />
              ) : phoneNumbers.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-4">No virtual DID lines provisioned.</div>
              ) : (
                phoneNumbers.slice(0, 2).map((phone) => (
                  <div
                    key={phone.id}
                    className="p-2 rounded border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                        {phone.phone_number}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        ↓ Assigned to: <span className="font-semibold text-slate-700 dark:text-slate-300">{phone.assigned_agent?.name || 'Inbound Reception'}</span>
                      </p>
                    </div>
                    <Badge variant={phone.status === 'active' ? 'success' : 'outline'} size="sm" className="text-[10px]">
                      {phone.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================== */}
      {/* BOTTOM OPERATIONAL PANELS: LEADS CRM + FOLLOW-UPS + KNOWLEDGE      */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pt-1">
        {/* SECTION 7 — ADMISSIONS LEAD PANEL */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
          <CardHeader className="py-2.5 px-3.5 border-b border-slate-200/80 dark:border-slate-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Admissions Leads ({leads.length})
              </CardTitle>
            </div>
            <Link
              href={`/${orgSlug}/leads`}
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800/80">
            {isLeadsLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : leads.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No student leads recorded yet.</div>
            ) : (
              leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => router.push(`/${orgSlug}/leads/${lead.id}`)}
                  className="p-3 flex items-center justify-between gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {lead.full_name || 'Prospective Applicant'}
                      </p>
                      <Badge
                        variant={getLeadStatusBadgeClass(lead.status) as any}
                        size="sm"
                        className="text-[9px] uppercase font-bold"
                      >
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {lead.course_interested || 'B.Tech Engineering'} • {formatPhoneNumber(lead.phone_number)}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    Score: {lead.lead_score || 75}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* SECTION 8 — FOLLOW-UP PANEL */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
          <CardHeader className="py-2.5 px-3.5 border-b border-slate-200/80 dark:border-slate-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Follow-ups ({followups.length})
              </CardTitle>
            </div>
            <Link
              href={`/${orgSlug}/followups`}
              className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800/80">
            {isFollowupsLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : followups.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No scheduled follow-up tasks.</div>
            ) : (
              followups.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  className="p-3 flex items-center justify-between gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {f.lead_name || 'Student Lead'}
                      </p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {f.followup_type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Due: {formatDateTime(f.scheduled_at)}
                    </p>
                  </div>
                  <Badge
                    variant={f.status === 'completed' ? 'success' : f.status === 'pending' ? 'warning' : 'outline'}
                    size="sm"
                    className="capitalize text-[10px]"
                  >
                    {f.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* SECTION 9 — AI KNOWLEDGE PANEL */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
          <CardHeader className="py-2.5 px-3.5 border-b border-slate-200/80 dark:border-slate-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Institutional Knowledge ({documents.length})
              </CardTitle>
            </div>
            <Link
              href={`/${orgSlug}/knowledge`}
              className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800/80">
            {/* Ready / Processing status pill */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Indexed Knowledge Docs:</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  {documents.filter((d) => d.status === 'ready' || d.status === 'indexed').length} Ready
                </span>
                {documents.filter((d) => d.status === 'processing').length > 0 && (
                  <span className="text-amber-600 font-bold">
                    {documents.filter((d) => d.status === 'processing').length} Processing
                  </span>
                )}
              </div>
            </div>

            {isKnowledgeLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : documents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No institutional documents uploaded yet.</div>
            ) : (
              documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="p-3 flex items-center justify-between gap-2.5 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate text-xs">
                      {doc.title}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      Category: {doc.category}
                    </p>
                  </div>
                  <Badge variant={doc.status === 'failed' ? 'danger' : 'success'} size="sm" className="text-[10px]">
                    {doc.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Resolve Follow-up Modal */}
      <Dialog
        open={Boolean(resolveTask)}
        onOpenChange={(open) => !open && setResolveTask(null)}
        title="Resolve Admissions Follow-up Task"
      >
        {resolveTask && (
          <form onSubmit={handleConfirmResolve} className="space-y-4 my-2">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                Applicant: {resolveTask.lead_name || 'Prospective Student'}
              </p>
              <p className="text-slate-500">
                Action: {resolveTask.followup_type.replace(/_/g, ' ')} • Due:{' '}
                {formatDateTime(resolveTask.scheduled_at)}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Resolution Outcome
              </label>
              <Textarea
                placeholder="e.g. Student contacted by counselor. Fee structure provided and campus visit confirmed."
                value={resolveOutcome}
                onChange={(e) => setResolveOutcome(e.target.value)}
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
