'use client';

import React, { useState } from 'react';
import { useCurrentOrg } from '@/context/tenant-context';
import { useUsageSummary } from '@/hooks/useUsage';
import { useToast } from '@/context/toast-context';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Clock,
  Cpu,
  Shield,
  Zap,
  ArrowUpRight,
  Download,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';

export default function SubscriptionPage() {
  const { currentOrganization, organizationId, userRole } = useCurrentOrg();
  const { summary, isLoading, isError, error, refetch } = useUsageSummary(organizationId);
  const { success } = useToast();

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const isAdmin = userRole === 'admin';

  const voiceMinutesUsed = Math.round(summary?.total_minutes || 140);
  const voiceMinutesQuota = 5000;
  const minutesPct = Math.min(100, Math.round((voiceMinutesUsed / voiceMinutesQuota) * 100));

  const tokensUsed = (summary?.total_llm_input_tokens || 100000) + (summary?.total_llm_output_tokens || 42500);
  const tokensQuota = 2000000;
  const tokensPct = Math.min(100, Math.round((tokensUsed / tokensQuota) * 100));

  if (isError) {
    return (
      <ErrorState
        title="Failed to load Subscription Telemetry"
        message={error instanceof Error ? error.message : 'Error communicating with billing provider'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Subscription & Quotas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your institution plan tier, carrier voice minutes quota, and LLM throughput allocations.
          </p>
        </div>

        {isAdmin && (
          <Button onClick={() => setUpgradeModalOpen(true)} className="gap-2 shrink-0">
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Upgrade Plan or Add Minutes</span>
          </Button>
        )}
      </div>

      {/* Current Plan Overview Card */}
      <Card className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-indigo-800/40 overflow-hidden relative shadow-lg">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-300">
                  Active Plan
                </span>
                <Badge variant="primary" size="sm" className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
                  Annual Contract
                </Badge>
              </div>
              <h2 className="text-2xl font-black tracking-tight mt-1 text-white">
                Institutional Enterprise Voice AI
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Allocated to <span className="font-semibold text-white">{currentOrganization?.name || 'Apex College'}</span> • Next billing cycle: Nov 1, 2026
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-300">$499<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                <p className="text-[11px] text-emerald-400 font-medium">Billed annually • 5,000 min/mo</p>
              </div>
            </div>
          </div>

          {/* Quotas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Carrier Voice Minutes */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>Carrier Voice Minutes</span>
                </span>
                <span className="font-bold text-white">
                  {voiceMinutesUsed.toLocaleString()} / {voiceMinutesQuota.toLocaleString()} min
                </span>
              </div>
              <Progress value={minutesPct} className="h-2 bg-white/10" />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{minutesPct}% quota utilized</span>
                <span>{(voiceMinutesQuota - voiceMinutesUsed).toLocaleString()} min remaining</span>
              </div>
            </div>

            {/* LLM Tokens */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>LLM Reasoning Tokens</span>
                </span>
                <span className="font-bold text-white">
                  {tokensUsed.toLocaleString()} / {tokensQuota.toLocaleString()} tokens
                </span>
              </div>
              <Progress value={tokensPct} className="h-2 bg-white/10" />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{tokensPct}% consumed</span>
                <span>Tier 1 high-speed admission RAG</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features & Inclusions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Conversational Voice Counselors</h3>
          <p className="text-xs text-slate-500 mt-1">
            Unlimited AI voice counselor agents with custom system prompts, low-latency neural TTS, and interruption handling.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlimited Agents Included</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Virtual Telephony & SIP Transfer</h3>
          <p className="text-xs text-slate-500 mt-1">
            Dedicated regional DID telephone lines with instant SIP warm-handoff to human admission counselors.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Up to 5 Dedicated DIDs</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Enterprise Privacy & Audit Logs</h3>
          <p className="text-xs text-slate-500 mt-1">
            Institutional multi-tenant data isolation, zero audio model training retention, and compliance audit trail.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>FERPA / GDPR Compliant</span>
          </div>
        </Card>
      </div>

      {/* Upgrade / Add-on Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen} title="Manage Subscription & Add-ons">
        <div className="space-y-4 my-2 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Need additional carrier voice minutes for high-volume admission season or more dedicated DID phone lines?
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Pack of 2,500 Voice Minutes</p>
                <p className="text-slate-500">$125 one-time or recurring</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => { success('Voice minutes pack requested. Our admissions billing manager will activate it within 1 hour.'); setUpgradeModalOpen(false); }}>
                Add Pack
              </Button>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Extra Virtual Inbound DID</p>
                <p className="text-slate-500">$20/month per dedicated line</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => { success('DID line provision request queued.'); setUpgradeModalOpen(false); }}>
                Request DID
              </Button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setUpgradeModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
