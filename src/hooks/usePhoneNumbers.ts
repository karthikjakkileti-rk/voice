'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataProvider } from '@/services/data-provider';

export function usePhoneNumbers(orgId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['phone-numbers', orgId],
    queryFn: () => (orgId ? dataProvider.getPhoneNumbers(orgId) : Promise.resolve([])),
    enabled: !!orgId,
  });

  const assignMutation = useMutation({
    mutationFn: ({ phoneId, agentId }: { phoneId: string; agentId: string }) => {
      if (!orgId) throw new Error('Org ID is required');
      return dataProvider.assignPhoneNumber(orgId, phoneId, agentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phone-numbers', orgId] });
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] });
    },
  });

  return {
    phoneNumbers: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    assignPhoneNumber: assignMutation.mutateAsync,
    isAssigning: assignMutation.isPending,
  };
}
