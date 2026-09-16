'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataProvider } from '@/services/data-provider';
import { Agent, AgentConfigUpdatePayload } from '@/types/api';

export function useAgents(orgId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['agents', orgId],
    queryFn: () => (orgId ? dataProvider.getAgents(orgId) : Promise.resolve([])),
    enabled: !!orgId,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) => {
      if (!orgId) throw new Error('Organization ID is required');
      return dataProvider.createAgent(orgId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ agentId, isActive }: { agentId: string; isActive: boolean }) => {
      if (!orgId) throw new Error('Organization ID is required');
      return dataProvider.toggleAgentStatus(orgId, agentId, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] });
    },
  });

  return {
    agents: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createAgent: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    toggleAgentStatus: toggleStatusMutation.mutateAsync,
  };
}

export function useAgent(orgId: string | null, agentId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['agent', orgId, agentId],
    queryFn: () => (orgId && agentId ? dataProvider.getAgent(orgId, agentId) : Promise.resolve(null)),
    enabled: !!orgId && !!agentId,
  });

  const updateConfigMutation = useMutation({
    mutationFn: (config: AgentConfigUpdatePayload) => {
      if (!orgId || !agentId) throw new Error('Org ID and Agent ID required');
      return dataProvider.updateAgentConfig(orgId, agentId, config);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['agent', orgId, agentId], updated);
      queryClient.invalidateQueries({ queryKey: ['agents', orgId] });
    },
  });

  return {
    agent: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateConfig: updateConfigMutation.mutateAsync,
    isUpdating: updateConfigMutation.isPending,
  };
}
