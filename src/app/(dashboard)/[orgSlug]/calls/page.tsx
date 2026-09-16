'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrentOrg } from '@/context/tenant-context';
import { useCalls } from '@/hooks/useCalls';
import {
  PhoneCall,
  Search,
  Filter,
  ArrowRight,
  Disc3,
  Clock,
  User,
  Sparkles,
  PhoneForwarded,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/shared/filter-bar';
import { Pagination } from '@/components/shared/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { formatDuration, formatTimeAgo, getSentimentBadgeClass, formatPhoneNumber } from '@/lib/utils';

export default function CallsPage() {
  const { organizationId, orgSlug } = useCurrentOrg();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');

  const { calls, meta, isLoading, isError, error, refetch } = useCalls(organizationId, {
    page,
    page_size: 15,
    search: searchQuery,
    status: statusFilter,
    direction: directionFilter,
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDirectionFilter('all');
    setPage(1);
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to load call sessions"
        message={error instanceof Error ? error.message : 'Error communicating with backend calls service'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Call Intelligence Logs</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review live and completed admission calls, recordings, sentiment analyses, and dialogue transcripts.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search phone number, student name..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'completed', label: 'Completed' },
              { value: 'transferred', label: 'Transferred (Handoff)' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'failed', label: 'Dropped / Failed' },
            ],
          },
          {
            key: 'direction',
            label: 'Direction',
            value: directionFilter,
            options: [
              { value: 'all', label: 'All Directions' },
              { value: 'inbound', label: 'Inbound' },
              { value: 'outbound', label: 'Outbound' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'status') setStatusFilter(val);
          if (key === 'direction') setDirectionFilter(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Calls Table Card */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ) : calls.length === 0 ? (
            <EmptyState
              icon={PhoneCall}
              title="No Call Logs Found"
              description="No admission call sessions matched your current search or status filters."
              actionLabel="Clear Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Caller / Student</th>
                    <th className="py-3 px-4">Counselor Agent</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4">Sentiment</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {calls.map((call) => (
                    <tr
                      key={call.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors group"
                    >
                      {/* Caller */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shrink-0">
                            {call.transferred_to_human ? (
                              <PhoneForwarded className="w-4 h-4 text-amber-500" />
                            ) : (
                              <PhoneCall className="w-4 h-4 text-indigo-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {formatPhoneNumber(call.caller_number)}
                            </p>
                            {call.lead_name ? (
                              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                                {call.lead_name}
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-400 capitalize">{call.direction || 'Inbound'}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Agent */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {call.agent_name || 'Maya — Counselor'}
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {formatDuration(call.duration_seconds)}
                      </td>

                      {/* Outcome */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                          {call.call_outcome?.replace(/_/g, ' ') || 'General Inquiry'}
                        </span>
                      </td>

                      {/* Sentiment */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium capitalize ${getSentimentBadgeClass(call.sentiment)}`}>
                          {call.sentiment || 'neutral'}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {formatTimeAgo(call.started_at || call.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/${orgSlug}/calls/${call.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                            <span>Details</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 border-t border-slate-100 dark:border-slate-800">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.total_pages}
              totalItems={meta.total}
              pageSize={meta.page_size}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
