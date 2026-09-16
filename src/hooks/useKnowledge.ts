'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataProvider } from '@/services/data-provider';

export function useKnowledge(orgId: string | null, category?: string, status?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['knowledge', orgId, category, status],
    queryFn: () => (orgId ? dataProvider.getKnowledge(orgId, category, status) : Promise.resolve([])),
    enabled: !!orgId,
  });

  const uploadMutation = useMutation({
    mutationFn: (data: { title: string; category: string; file_type?: string; file_size_bytes?: number; file?: File }) => {
      if (!orgId) throw new Error('Org ID is required');
      return dataProvider.uploadKnowledgeDoc(orgId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', orgId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (docId: string) => {
      if (!orgId) throw new Error('Org ID is required');
      return dataProvider.deleteKnowledgeDoc(orgId, docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', orgId] });
    },
  });

  return {
    documents: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    uploadDocument: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteDocument: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
