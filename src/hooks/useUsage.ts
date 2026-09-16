'use client';

import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/services/data-provider';

export function useUsageSummary(orgId: string | null, fromDate?: string, toDate?: string) {
  const query = useQuery({
    queryKey: ['usage-summary', orgId, fromDate, toDate],
    queryFn: () => (orgId ? dataProvider.getUsageSummary(orgId, fromDate, toDate) : Promise.resolve(null)),
    enabled: !!orgId,
  });

  return {
    summary: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useUsageAnalytics(orgId: string | null) {
  const query = useQuery({
    queryKey: ['usage-analytics', orgId],
    queryFn: () => (orgId ? dataProvider.getUsageAnalytics(orgId) : Promise.resolve(null)),
    enabled: !!orgId,
  });

  return {
    analytics: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
