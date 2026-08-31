import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Subscribe to newsletter (public)
export const useSubscribe = () => {
  return useMutation({
    mutationFn: (data) => api.subscribe(data),
  });
};

// Verify subscriber (public)
export const useVerifySubscriber = (email) => {
  return useQuery({
    queryKey: ['subscribers', 'verify', email],
    queryFn: async () => {
      const response = await api.verifySubscriber(email);
      return response.data;
    },
    enabled: !!email,
  });
};

// Get all subscribers (Admin only)
export const useSubscribers = () => {
  return useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const response = await api.getSubscribers();
      return response.data.data;
    },
  });
};

// Get subscriber stats (Admin only)
export const useSubscriberStats = () => {
  return useQuery({
    queryKey: ['subscribers', 'stats'],
    queryFn: async () => {
      try {
        const response = await api.getSubscriberStats();
        return response.data.data;
      } catch (error) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
};

// Delete subscriber (Admin only)
export const useDeleteSubscriber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['subscribers', 'stats'] });
    },
  });
};

// Bulk delete subscribers (Admin only)
export const useBulkDeleteSubscribers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => api.bulkDeleteSubscribers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['subscribers', 'stats'] });
    },
  });
};