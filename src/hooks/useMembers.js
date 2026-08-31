import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Get all members
export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await api.getMembers();
      return response.data.data;
    },
  });
};

export const useMember = (id) => {
  return useQuery({
    queryKey: ['members', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.getMember(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateMember(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', variables.id] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useBulkDeleteMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => api.bulkDeleteMembers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};