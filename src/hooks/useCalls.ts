'use client';

import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/services/data-provider';
import { Call, PaginatedResponse } from '@/types/api';

export function useCalls(
  orgId: string | null,
  filters: {
    page?: number;
    page_size?: number;
    status?: string;
    direction?: string;
    agent_id?: string;
    search?: string;
  } = {}
) {
  const query = useQuery<PaginatedResponse<Call>>({
    queryKey: ['calls', orgId, filters],
    queryFn: (): Promise<PaginatedResponse<Call>> =>
      orgId
        ? dataProvider.getCalls(orgId, filters)
        : Promise.resolve({
            success: true as const,
            data: [],
            meta: { total: 0, page: 1, page_size: 20, total_pages: 1 },
          }),
    enabled: !!orgId,
  });

  return {
    calls: query.data?.data || [],
    meta: query.data?.meta || { total: 0, page: 1, page_size: 20, total_pages: 1 },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCall(orgId: string | null, callId: string | null) {
  const query = useQuery({
    queryKey: ['call', orgId, callId],
    queryFn: () => (orgId && callId ? dataProvider.getCall(orgId, callId) : Promise.resolve(null)),
    enabled: !!orgId && !!callId,
  });

  return {
    call: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
