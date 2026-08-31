import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Get all shows
export const useShows = () => {
  return useQuery({
    queryKey: ['shows'],
    queryFn: async () => {
      const response = await api.getShows();
      return response.data.data;
    },
  });
};

// Get upcoming shows
export const useUpcomingShows = () => {
  return useQuery({
    queryKey: ['shows', 'upcoming'],
    queryFn: async () => {
      const response = await api.getUpcomingShows();
      return response.data.data;
    },
  });
};

// Get single show - FIXED to handle caching properly
export const useShow = (id) => {
  return useQuery({
    queryKey: ['shows', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.getShow(id);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 0, // Don't cache stale data
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window focuses
  });
};

// Create show (Admin only)
export const useCreateShow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.createShow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
    },
  });
};

// Update show (Admin only)
export const useUpdateShow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateShow(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
      queryClient.invalidateQueries({ queryKey: ['shows', variables.id] });
    },
  });
};

// Delete show (Admin only)
export const useDeleteShow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
    },
  });
};

// Bulk delete shows (Admin only)
export const useBulkDeleteShows = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => api.bulkDeleteShows(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
    },
  });
};
