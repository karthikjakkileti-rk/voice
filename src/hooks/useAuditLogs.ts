'use client';

import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/services/data-provider';

export function useAuditLogs(orgId: string | null) {
  const query = useQuery({
    queryKey: ['audit-logs', orgId],
    queryFn: () => (orgId ? dataProvider.getAuditLogs(orgId) : Promise.resolve({ supported: false, data: [] })),
    enabled: !!orgId,
  });

  return {
    auditLogs: query.data?.data || [],
    isSupported: query.data?.supported ?? false,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
