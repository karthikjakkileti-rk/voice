'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentOrg } from '@/context/tenant-context';
import { useSubscription } from '@/hooks/useSubscription';
import { useUsageSummary } from '@/hooks/useUsage';
import { usePhoneNumbers } from '@/hooks/usePhoneNumbers';
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
  Edit3,
  Calendar,
  Lock,
  Layers,
  ArrowRight,
  TrendingUp,
  Receipt,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SubscriptionPage() {
  const { currentOrganization, organizationId, userRole } = useCurrentOrg();
  const {
    subscription,
    isLoading: isSubLoading,
    isError: isSubError,
    error: subError,
    refetch: refetchSub,
    updateSubscription,
    isUpdating,
  } = useSubscription(organizationId);

  const {
    summary,
    isLoading: isUsageLoading,
    isError: isUsageError,
    refetch: refetchUsage,
  } = useUsageSummary(organizationId);

  const { phoneNumbers } = usePhoneNumbers(organizationId);
  const { success, error: toastError } = useToast();

  const isAdmin = userRole === 'admin';

  // Modal & Edit Form State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [planTier, setPlanTier] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [planName, setPlanName] = useState('Institutional Pro');
  const [priceAmount, setPriceAmount] = useState('15000');
  const [currency, setCurrency] = useState('INR');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [voiceMinutesLimit, setVoiceMinutesLimit] = useState('5000');
  const [callLimit, setCallLimit] = useState('2000');
  const [phoneNumbersLimit, setPhoneNumbersLimit] = useState('5');
  const [renewalDate, setRenewalDate] = useState('2026-10-24');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Sync state whenever subscription data is loaded or opened
  const populateFormData = () => {
    if (!subscription) return;
    const effectivePrice =
      subscription.price_amount !== undefined
        ? subscription.price_amount
        : subscription.amount_cents !== undefined
        ? subscription.amount_cents / 100
        : 15000;

    setPlanTier((subscription.plan_tier as any) || 'pro');
    setPlanName(subscription.plan_name || (subscription.plan_tier === 'enterprise' ? 'University Enterprise Cloud' : 'Institutional Pro'));
    setPriceAmount(String(effectivePrice));
    setCurrency(subscription.currency || 'INR');
    setBillingCycle((subscription.billing_cycle as any) || 'monthly');
    setVoiceMinutesLimit(String(subscription.voice_minutes_limit ?? 5000));
    setCallLimit(String(subscription.call_limit ?? 2000));
    setPhoneNumbersLimit(String(subscription.phone_numbers_limit ?? 5));

    const dateStr = subscription.renewal_date || subscription.current_period_end;
    if (dateStr) {
      setRenewalDate(dateStr.slice(0, 10));
    } else {
      setRenewalDate('2026-10-24');
    }
    setFormErrors({});
  };

  const handleOpenEdit = () => {
    populateFormData();
    setIsEditModalOpen(true);
  };

  // Form Validation and Submission
  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const cleanPrice = priceAmount.trim();
    const numPrice = parseFloat(cleanPrice);

    if (!cleanPrice || isNaN(numPrice)) {
      errors.price = 'Please enter a valid numeric price amount.';
    } else if (numPrice < 0) {
      errors.price = 'Price cannot be negative.';
    } else if (!/^\d+(\.\d{1,2})?$/.test(cleanPrice)) {
      errors.price = 'Price cannot exceed 2 decimal places.';
    }

    if (!planName.trim()) {
      errors.planName = 'Plan name is required.';
    }

    const numMinutes = parseInt(voiceMinutesLimit);
    if (isNaN(numMinutes) || numMinutes < 0) {
      errors.voiceMinutes = 'Voice minutes limit must be a non-negative integer.';
    }

    const numCalls = parseInt(callLimit);
    if (isNaN(numCalls) || numCalls < 0) {
      errors.calls = 'Call limit must be a non-negative integer.';
    }

    const numPhones = parseInt(phoneNumbersLimit);
    if (isNaN(numPhones) || numPhones < 0) {
      errors.phones = 'Phone numbers limit must be a non-negative integer.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const renewalIso = renewalDate ? new Date(`${renewalDate}T23:59:59Z`).toISOString() : undefined;

      await updateSubscription({
        plan_tier: planTier,
        plan_name: planName.trim(),
        price_amount: numPrice,
        amount_cents: Math.round(numPrice * 100),
        currency,
        billing_cycle: billingCycle,
        voice_minutes_limit: numMinutes,
        call_limit: numCalls,
        phone_numbers_limit: numPhones,
        renewal_date: renewalIso,
        current_period_end: renewalIso,
      });

      success('Subscription and pricing configured successfully.');
      setIsEditModalOpen(false);
    } catch (err: any) {
      toastError(err.message || 'Failed to update subscription');
    }
  };

  if (isSubError || isUsageError) {
    return (
      <ErrorState
        title="Failed to load Subscription & Pricing Information"
        message={subError instanceof Error ? subError.message : 'Error communicating with subscription billing service'}
        onRetry={() => {
          refetchSub();
          refetchUsage();
        }}
      />
    );
  }

  // Real effective values from subscription model
  const effectivePrice =
    subscription?.price_amount !== undefined
      ? subscription.price_amount
      : subscription?.amount_cents !== undefined
      ? subscription.amount_cents / 100
      : 15000;

  const currentCurrency = subscription?.currency || 'INR';
  const currentCycle = subscription?.billing_cycle || 'monthly';
  const currentPlanName = subscription?.plan_name || 'Institutional Pro';
  const currentRenewalDate = subscription?.renewal_date || subscription?.current_period_end || '2026-10-24T23:59:59Z';
  const currentStatus = subscription?.status || 'active';

  // Quotas & Consumption
  const voiceMinutesUsed = Math.round(summary?.total_minutes || 0);
  const voiceMinutesQuota = subscription?.voice_minutes_limit ?? 5000;
  const minutesPct = Math.min(100, Math.round((voiceMinutesUsed / Math.max(1, voiceMinutesQuota)) * 100));

  const callsUsed = summary?.total_calls || 0;
  const callsQuota = subscription?.call_limit ?? 2000;
  const callsPct = Math.min(100, Math.round((callsUsed / Math.max(1, callsQuota)) * 100));

  const phoneNumbersCount = phoneNumbers?.length || 1;
  const phoneNumbersQuota = subscription?.phone_numbers_limit ?? 5;
  const phonePct = Math.min(100, Math.round((phoneNumbersCount / Math.max(1, phoneNumbersQuota)) * 100));

  const tokensUsed = (summary?.total_llm_input_tokens || 0) + (summary?.total_llm_output_tokens || 0);
  const tokensQuota = 2000000;
  const tokensPct = Math.min(100, Math.round((tokensUsed / tokensQuota) * 100));

  const cycleDisplayMap: Record<string, string> = {
    monthly: 'month',
    quarterly: 'quarter',
    annual: 'year',
  };
  const cycleUnit = cycleDisplayMap[currentCycle] || 'month';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Subscription & Plan
            </h1>
            <Badge variant="primary" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              Operations Billing
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure institution plan tier, contracted pricing rate, billing cycle, and telecom resource quotas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Button
              onClick={handleOpenEdit}
              className="gap-2 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              id="btn-edit-plan"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Plan & Pricing</span>
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Read-only (Admin role required to configure pricing)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Subscription Operations Card */}
      {isSubLoading ? (
        <Skeleton className="h-56 w-full rounded-2xl" />
      ) : (
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Active Subscription
                  </span>
                  <Badge variant="success" size="sm" className="capitalize">
                    ● {currentStatus}
                  </Badge>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {subscription?.plan_tier || 'pro'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {currentPlanName}
                </h2>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Allocated to <span className="font-semibold text-slate-800 dark:text-slate-200">{currentOrganization?.name || 'Institution'}</span>
                  </span>
                  <span>•</span>
                  <span>Billing Frequency: <strong className="capitalize text-slate-700 dark:text-slate-300">{currentCycle}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Renewal Date: <strong className="text-slate-700 dark:text-slate-300">{formatDate(currentRenewalDate)}</strong>
                  </span>
                </div>
              </div>

              {/* Exact Configured Price Callout */}
              <div className="lg:text-right bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 min-w-[240px]">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Contracted Price</p>
                <div className="flex items-baseline lg:justify-end gap-1.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                    {formatCurrency(effectivePrice, currentCurrency)}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    / {cycleUnit}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center lg:justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Configured by Institution Owner</span>
                </p>
              </div>
            </div>

            {/* Quotas & Usage Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              {/* Carrier Voice Minutes */}
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                    <PhoneCall className="w-4 h-4 text-indigo-600" />
                    <span>Voice Minutes</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {voiceMinutesUsed.toLocaleString()} / {voiceMinutesQuota.toLocaleString()}
                  </span>
                </div>
                <Progress value={minutesPct} className="h-1.5" />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{minutesPct}% consumed</span>
                  <span>{Math.max(0, voiceMinutesQuota - voiceMinutesUsed).toLocaleString()} min left</span>
                </div>
              </div>

              {/* Call Sessions */}
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Call Volume</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {callsUsed.toLocaleString()} / {callsQuota.toLocaleString()}
                  </span>
                </div>
                <Progress value={callsPct} className="h-1.5" />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{callsPct}% quota</span>
                  <span>{Math.max(0, callsQuota - callsUsed).toLocaleString()} remaining</span>
                </div>
              </div>

              {/* Virtual Phone Lines */}
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Virtual DID Lines</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {phoneNumbersCount} / {phoneNumbersQuota}
                  </span>
                </div>
                <Progress value={phonePct} className="h-1.5" />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{phonePct}% assigned</span>
                  <span>{Math.max(0, phoneNumbersQuota - phoneNumbersCount)} available</span>
                </div>
              </div>

              {/* LLM Tokens */}
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    <span>LLM Tokens</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {Math.round(tokensUsed / 1000)}k / {Math.round(tokensQuota / 1000)}k
                  </span>
                </div>
                <Progress value={tokensPct} className="h-1.5" />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{tokensPct}% throughput</span>
                  <span>Admissions RAG</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Commercial Terms & Pricing Breakdown Table */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-600" />
                Commercial Terms & Subscription Details
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Current financial parameters and contractual billing terms for this institution.
              </CardDescription>
            </div>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={handleOpenEdit} className="text-xs gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Adjust Pricing</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Plan Tier & Name</span>
              <span className="font-bold text-slate-900 dark:text-white md:col-span-2">
                {currentPlanName} <span className="text-slate-400 font-normal">({subscription?.plan_tier || 'pro'})</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Configured Rate</span>
              <div className="md:col-span-2 flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                  {formatCurrency(effectivePrice, currentCurrency)}
                </span>
                <span className="text-slate-500">per {cycleUnit}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Currency</span>
              <span className="font-semibold text-slate-900 dark:text-white md:col-span-2">
                {currentCurrency} ({currentCurrency === 'INR' ? 'Indian Rupee - ₹' : currentCurrency})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Billing Cadence</span>
              <span className="font-semibold text-slate-900 dark:text-white capitalize md:col-span-2">
                {currentCycle} Invoicing
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Scheduled Renewal</span>
              <span className="font-semibold text-slate-900 dark:text-white md:col-span-2">
                {formatDate(currentRenewalDate)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Carrier Trunk Quota</span>
              <span className="font-semibold text-slate-900 dark:text-white md:col-span-2">
                {voiceMinutesQuota.toLocaleString()} carrier minutes / {cycleUnit}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Dedicated Virtual DIDs</span>
              <span className="font-semibold text-slate-900 dark:text-white md:col-span-2">
                {phoneNumbersQuota} virtual DID telephone lines included
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Authorization & RBAC</span>
              <span className="text-slate-600 dark:text-slate-400 md:col-span-2 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized by institution platform administrator (Role: <strong>{userRole}</strong>)</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Institutional Entitlements & Features Included */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Conversational Voice Counselors</h3>
          <p className="text-xs text-slate-500 mt-1">
            Institutional AI counselors with custom curriculum prompts, low-latency neural Indian English speech, and interruption handling.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active on All Inbound Lines</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <PhoneCall className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Virtual Telephony & SIP Transfer</h3>
          <p className="text-xs text-slate-500 mt-1">
            Dedicated regional DID telephone lines with instant SIP warm-handoff to human admission officers.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{phoneNumbersQuota} Lines Provisioned</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Enterprise Privacy & Audit Logs</h3>
          <p className="text-xs text-slate-500 mt-1">
            Institutional multi-tenant data isolation, zero audio model retention, and verifiable compliance audit trail.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>FERPA / GDPR Compliant</span>
          </div>
        </Card>
      </div>

      {/* EDIT PLAN & PRICING MODAL */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Configure Institution Subscription & Pricing"
        description="Define the exact price, currency, billing cycle, and telecom quotas to charge this institution."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveSubscription} className="space-y-4 my-2 text-xs">
          {/* Plan Tier & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Plan Tier"
              value={planTier}
              onChange={(e) => setPlanTier(e.target.value as any)}
              options={[
                { value: 'starter', label: 'Starter Tier' },
                { value: 'pro', label: 'Professional (Pro)' },
                { value: 'enterprise', label: 'Institutional Enterprise' },
              ]}
            />
            <Input
              label="Plan Name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. Institutional Pro"
              error={formErrors.planName}
            />
          </div>

          {/* Exact Price & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Price Amount"
                value={priceAmount}
                onChange={(e) => {
                  setPriceAmount(e.target.value);
                  if (formErrors.price) {
                    setFormErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.price;
                      return copy;
                    });
                  }
                }}
                placeholder="e.g. 15000"
                error={formErrors.price}
                helperText="Enter the exact amount to charge this institution."
              />
            </div>

            <Select
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'INR', label: 'INR (₹ - Indian Rupee)' },
                { value: 'USD', label: 'USD ($ - US Dollar)' },
                { value: 'EUR', label: 'EUR (€ - Euro)' },
                { value: 'GBP', label: 'GBP (£ - British Pound)' },
              ]}
              helperText="Settlement currency for this organization."
            />
          </div>

          {/* Billing Cycle & Renewal Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Billing Cycle"
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value as any)}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'annual', label: 'Annual / Yearly' },
              ]}
            />
            <Input
              label="Next Renewal Date"
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              helperText="Date of next scheduled recurring billing."
            />
          </div>

          {/* Resource Quotas */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Telephony & Resource Quotas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Voice Minutes Limit"
                value={voiceMinutesLimit}
                onChange={(e) => setVoiceMinutesLimit(e.target.value)}
                placeholder="5000"
                error={formErrors.voiceMinutes}
              />
              <Input
                label="Call Volume Limit"
                value={callLimit}
                onChange={(e) => setCallLimit(e.target.value)}
                placeholder="2000"
                error={formErrors.calls}
              />
              <Input
                label="Virtual DID Limit"
                value={phoneNumbersLimit}
                onChange={(e) => setPhoneNumbersLimit(e.target.value)}
                placeholder="5"
                error={formErrors.phones}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isUpdating}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              id="btn-save-subscription"
            >
              {isUpdating ? 'Saving...' : 'Save Subscription'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
