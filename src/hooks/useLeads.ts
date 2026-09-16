'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataProvider } from '@/services/data-provider';
import { Lead, LeadCreatePayload, LeadUpdatePayload, PaginatedResponse } from '@/types/api';

export function useLeads(
  orgId: string | null,
  filters: {
    page?: number;
    page_size?: number;
    status?: string;
    interest_level?: string;
    search?: string;
  } = {}
) {
  const queryClient = useQueryClient();

  const query = useQuery<PaginatedResponse<Lead>>({
    queryKey: ['leads', orgId, filters],
    queryFn: (): Promise<PaginatedResponse<Lead>> =>
      orgId
        ? dataProvider.getLeads(orgId, filters)
        : Promise.resolve({
            success: true as const,
            data: [],
            meta: { total: 0, page: 1, page_size: 20, total_pages: 1 },
          }),
    enabled: !!orgId,
  });

  const createMutation = useMutation({
    mutationFn: (data: LeadCreatePayload) => {
      if (!orgId) throw new Error('Org ID is required');
      return dataProvider.createLead(orgId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', orgId] });
      queryClient.invalidateQueries({ queryKey: ['usage', orgId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: LeadUpdatePayload }) => {
      if (!orgId) throw new Error('Org ID is required');
      return dataProvider.updateLead(orgId, leadId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads', orgId] });
      queryClient.invalidateQueries({ queryKey: ['lead', orgId, variables.leadId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (leadId: string) => {
      if (!orgId) throw new Error('Org ID is required');
      return dataProvider.deleteLead(orgId, leadId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', orgId] });
    },
  });

  return {
    leads: query.data?.data || [],
    meta: query.data?.meta || { total: 0, page: 1, page_size: 20, total_pages: 1 },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createLead: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateLead: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteLead: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useLead(orgId: string | null, leadId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['lead', orgId, leadId],
    queryFn: () => (orgId && leadId ? dataProvider.getLead(orgId, leadId) : Promise.resolve(null)),
    enabled: !!orgId && !!leadId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: LeadUpdatePayload) => {
      if (!orgId || !leadId) throw new Error('Org ID and Lead ID are required');
      return dataProvider.updateLead(orgId, leadId, data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['lead', orgId, leadId], updated);
      queryClient.invalidateQueries({ queryKey: ['leads', orgId] });
    },
  });

  return {
    lead: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateLead: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
