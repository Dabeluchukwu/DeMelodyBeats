import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Get all photos
export const usePhotos = () => {
  return useQuery({
    queryKey: ['media', 'photos'],
    queryFn: async () => {
      const response = await api.getPhotos();
      return response.data.data;
    },
  });
};

// Get all videos
export const useVideos = () => {
  return useQuery({
    queryKey: ['media', 'videos'],
    queryFn: async () => {
      const response = await api.getVideos();
      return response.data.data;
    },
  });
};

// Upload photo
export const useUploadPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.createPhoto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media', 'photos'] });
    },
  });
};

// Upload video
export const useUploadVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media', 'videos'] });
    },
  });
};

// Delete photo
export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deletePhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media', 'photos'] });
    },
  });
};

// Delete video
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media', 'videos'] });
    },
  });
};

// Bulk delete photos
export const useBulkDeletePhotos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => api.bulkDeletePhotos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media', 'photos'] });
    },
  });
};

// Bulk delete videos
export const useBulkDeleteVideos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => api.bulkDeleteVideos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media', 'videos'] });
    },
  });
};