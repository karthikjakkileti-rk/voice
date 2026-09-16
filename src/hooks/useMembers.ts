'use client';

import { useQuery } from '@tanstack/react-query';
import { dataProvider } from '@/services/data-provider';
import { OrganizationMember } from '@/types/api';

export function useMembers(orgId: string | null) {
  const query = useQuery<OrganizationMember[]>({
    queryKey: ['organization-members', orgId],
    queryFn: () => (orgId ? dataProvider.getMembers(orgId) : Promise.resolve([])),
    enabled: !!orgId,
    staleTime: 60 * 1000,
  });

  return {
    members: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
