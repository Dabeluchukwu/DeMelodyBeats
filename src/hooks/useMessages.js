import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Get all messages
export const useMessages = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await api.getMessages();
      return response.data.data;
    },
  });
};

// Get unread count
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['messages', 'unread'],
    queryFn: async () => {
      const response = await api.getUnreadCount();
      return response.data.data.unread;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Get single message
export const useMessage = (id) => {
  return useQuery({
    queryKey: ['messages', id],
    queryFn: async () => {
      const response = await api.getMessage(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Reply to message
export const useReplyToMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }) => api.replyToMessage(id, reply),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread'] });
    },
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread'] });
    },
  });
};

// Bulk delete messages
export const useBulkDeleteMessages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => api.bulkDeleteMessages(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread'] });
    },
  });
};