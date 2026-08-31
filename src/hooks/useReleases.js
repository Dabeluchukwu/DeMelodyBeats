import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useReleases = () => {
  return useQuery({
    queryKey: ['releases'],
    queryFn: async () => {
      const response = await api.getReleases();
      return response.data.data;
    },
  });
};

export const useFeaturedRelease = () => {
  return useQuery({
    queryKey: ['releases', 'featured'],
    queryFn: async () => {
      const response = await api.getFeaturedRelease();
      return response.data.data;
    },
  });
};

export const useRelease = (id) => {
  return useQuery({
    queryKey: ['releases', id],
    queryFn: async () => {
      const response = await api.getRelease(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Mutations (Admin only)
export const useCreateRelease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.createRelease(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
    },
  });
};

export const useUpdateRelease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateRelease(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      queryClient.invalidateQueries({ queryKey: ['releases', variables.id] });
    },
  });
};

export const useDeleteRelease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteRelease(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
    },
  });
};


export const useBulkDeleteReleases = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => api.bulkDeleteReleases(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
    },
  });
};


export const useAddSong = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ releaseId, data }) => api.addSong(releaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['releases', variables.releaseId] });
    },
  });
};

export const useUpdateSong = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateSong(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
    },
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteSong(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
    },
  });
};