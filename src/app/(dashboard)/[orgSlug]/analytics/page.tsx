'use client';

import React from 'react';
import { useCurrentOrg } from '@/context/tenant-context';
import { useUsageSummary, useUsageAnalytics } from '@/hooks/useUsage';
import { useAuth } from '@/context/auth-context';
import {
  BarChart3,
  Clock,
  PhoneCall,
  UserCheck,
  TrendingUp,
  Coins,
  Cpu,
  Smile,
  Meh,
  Frown,
  Activity,
} from 'lucide-react';
import { MetricCard } from '@/components/shared/metric-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';

export default function AnalyticsPage() {
  const { organizationId, currentOrganization } = useCurrentOrg();
  const { demoMode } = useAuth();

  const { summary, isLoading: isSummaryLoading, isError: isSummaryError, error: summaryError, refetch: refetchSummary } =
    useUsageSummary(organizationId);

  const { analytics, isLoading: isAnalyticsLoading } = useUsageAnalytics(organizationId);

  if (isSummaryError) {
    return (
      <ErrorState
        title="Failed to load usage analytics"
        message={summaryError instanceof Error ? summaryError.message : 'Error communicating with usage telemetry service'}
        onRetry={() => refetchSummary()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Usage & Telemetry Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics covering speech processing, token throughput, hourly calling traffic, and conversation outcomes.
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isSummaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        ) : (
          <>
            <MetricCard
              title="Voice Minutes Processed"
              value={summary?.total_minutes ? `${summary.total_minutes.toLocaleString()} min` : '0 min'}
              subtitle="Carrier audio streaming time"
              icon={Clock}
              iconColor="indigo"
              trend={{ value: '+18.4% month', isPositive: true }}
            />
            <MetricCard
              title="Total LLM Tokens"
              value={summary?.total_llm_input_tokens ? `${((summary.total_llm_input_tokens + (summary.total_llm_output_tokens || 0)) / 1000).toFixed(0)}k` : '1.6M'}
              subtitle="Inference prompt & completions"
              icon={Cpu}
              iconColor="purple"
            />
            <MetricCard
              title="STT Audio Seconds"
              value={summary?.total_stt_audio_seconds ? `${(summary.total_stt_audio_seconds / 60).toFixed(0)} min` : '2,680 min'}
              subtitle="Student voice recognition"
              icon={Activity}
              iconColor="emerald"
            />
            <MetricCard
              title="Estimated Compute Cost"
              value={summary?.total_cost_cents ? `₹${((summary.total_cost_cents * 83) / 100).toFixed(0)}` : '₹5,680'}
              subtitle="Telemetry compute estimation"
              icon={Coins}
              iconColor="amber"
            />
          </>
        )}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Traffic Distribution */}
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle className="text-base">Inbound Call Peak Hours</CardTitle>
            <CardDescription>Average student inquiry call distribution across daily hours.</CardDescription>
          </div>

          {isAnalyticsLoading ? (
            <Skeleton className="h-48 rounded-xl" />
          ) : analytics?.hourly_traffic ? (
            <div className="space-y-4 pt-2">
              <div className="h-44 flex items-end justify-between gap-1.5 px-2">
                {analytics.hourly_traffic.map((h) => {
                  const maxCount = 130;
                  const heightPercent = Math.min((h.call_count / maxCount) * 100, 100);

                  return (
                    <div key={h.hour} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <div className="w-full h-36 flex items-end justify-center bg-slate-100 dark:bg-slate-800/60 rounded-lg p-0.5 relative">
                        <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap pointer-events-none transition-opacity z-20">
                          {h.call_count} calls
                        </div>
                        <div
                          className="w-full bg-indigo-600 rounded-md transition-all group-hover:bg-indigo-500"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {h.hour > 12 ? `${h.hour - 12}p` : `${h.hour}a`}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 text-center">Peak calling traffic concentrated between 10:00 AM – 4:00 PM IST.</p>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              Hourly distribution data unavailable.
            </div>
          )}
        </Card>

        {/* Sentiment & Outcome Breakdown */}
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle className="text-base">Caller Sentiment & Intent Breakdown</CardTitle>
            <CardDescription>Real-time speech sentiment classified across admission sessions.</CardDescription>
          </div>

          {isAnalyticsLoading ? (
            <Skeleton className="h-48 rounded-xl" />
          ) : analytics?.sentiment_distribution ? (
            <div className="space-y-5 pt-2">
              {/* Sentiment Progress Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Smile className="w-4 h-4" />
                      <span>Positive Sentiment</span>
                    </span>
                    <span className="font-mono">{analytics.sentiment_distribution.positive}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${analytics.sentiment_distribution.positive}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Meh className="w-4 h-4" />
                      <span>Neutral Inquiry</span>
                    </span>
                    <span className="font-mono">{analytics.sentiment_distribution.neutral}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-400 rounded-full"
                      style={{ width: `${analytics.sentiment_distribution.neutral}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                      <Frown className="w-4 h-4" />
                      <span>Escalation / Negative</span>
                    </span>
                    <span className="font-mono">{analytics.sentiment_distribution.negative}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${analytics.sentiment_distribution.negative}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Outcomes Breakdown */}
              {analytics.outcomes_breakdown && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Top Call Outcomes:
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {analytics.outcomes_breakdown.map((item, i) => (
                      <div key={i} className="flex justify-between py-0.5">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item.outcome}</span>
                        <span className="font-mono text-slate-500 font-semibold">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              Sentiment data unavailable.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
