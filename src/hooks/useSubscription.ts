'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataProvider } from '@/services/data-provider';
import { Subscription } from '@/types/api';

export function useSubscription(orgId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['subscription', orgId],
    queryFn: () => (orgId ? dataProvider.getSubscription(orgId) : Promise.resolve(null)),
    enabled: !!orgId,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Subscription>) => {
      if (!orgId) throw new Error('Organization ID is required');
      return dataProvider.updateSubscription(orgId, payload);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['subscription', orgId], updated);
      queryClient.invalidateQueries({ queryKey: ['subscription', orgId] });
    },
  });

  return {
    subscription: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateSubscription: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
