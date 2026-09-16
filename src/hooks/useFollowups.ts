'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataProvider } from '@/services/data-provider';

export function useFollowups(orgId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['followups', orgId],
    queryFn: () => (orgId ? dataProvider.getFollowups(orgId) : Promise.resolve({ supported: false, data: [] })),
    enabled: !!orgId,
  });

  const completeMutation = useMutation({
    mutationFn: ({ followupId, outcome }: { followupId: string; outcome: string }) => {
      if (!orgId) throw new Error('Org ID is required');
      return dataProvider.completeFollowup(orgId, followupId, outcome);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followups', orgId] });
    },
  });

  return {
    followups: query.data?.data || [],
    isSupported: query.data?.supported ?? false,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    completeFollowup: completeMutation.mutateAsync,
  };
}
