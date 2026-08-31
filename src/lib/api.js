import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the full error for debugging
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      },
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response?.data?.message || 'You do not have permission.');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.config?.url);
    }

    // Handle 500 Internal Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data?.message || 'Internal server error.');
    }

    // Network errors (no response)
    if (!error.response) {
      console.error('Network error - please check your connection:', error.message);
    }

    // Return the error so components can handle it
    return Promise.reject(error);
  }
);

// API helper functions
export const api = {
  // Shows
  getShows: () => apiClient.get('/shows'),
  getUpcomingShows: () => apiClient.get('/shows/upcoming'),
  getShow: (id) => apiClient.get(`/shows/${id}`),
  createShow: (data) => apiClient.post('/shows', data),
  updateShow: (id, data) => apiClient.put(`/shows/${id}`, data),
  deleteShow: (id) => apiClient.delete(`/shows/${id}`),
  bulkDeleteShows: (ids) => apiClient.post('/shows/bulk-delete', { ids }),

 // Members
  getMembers: () => apiClient.get('/members'),
  getMember: (id) => apiClient.get(`/members/${id}`),
  createMember: (data) => apiClient.post('/members', data),
  updateMember: (id, data) => apiClient.put(`/members/${id}`, data),
  deleteMember: (id) => apiClient.delete(`/members/${id}`),
  bulkDeleteMembers: (ids) => apiClient.post('/members/bulk-delete', { ids }),

  // Releases
  getReleases: () => apiClient.get('/releases'),
  getFeaturedRelease: () => apiClient.get('/releases/featured'),
  getRelease: (id) => apiClient.get(`/releases/${id}`),
  createRelease: (data) => apiClient.post('/releases', data),
  updateRelease: (id, data) => apiClient.put(`/releases/${id}`, data),
  deleteRelease: (id) => apiClient.delete(`/releases/${id}`),
  bulkDeleteReleases: (ids) => apiClient.post('/releases/bulk-delete', { ids }),
  addSong: (releaseId, data) => apiClient.post(`/releases/${releaseId}/songs`, data),
  updateSong: (id, data) => apiClient.put(`/releases/songs/${id}`, data),
  deleteSong: (id) => apiClient.delete(`/releases/songs/${id}`),

   // Messages
  getMessages: () => apiClient.get('/messages'),
  getUnreadCount: () => apiClient.get('/messages/unread/count'),
  getMessage: (id) => apiClient.get(`/messages/${id}`),
  replyToMessage: (id, reply) => apiClient.post(`/messages/${id}/reply`, { reply }),
  deleteMessage: (id) => apiClient.delete(`/messages/${id}`),
  bulkDeleteMessages: (ids) => apiClient.post('/messages/bulk-delete', { ids }),

  // Subscribers
  subscribe: (data) => apiClient.post('/subscribers', data),
  verifySubscriber: (email) => apiClient.get(`/subscribers/verify/${email}`),
  getSubscribers: () => apiClient.get('/subscribers'),
  getSubscriberStats: () => apiClient.get('/subscribers/stats'),
  deleteSubscriber: (id) => apiClient.delete(`/subscribers/${id}`),
  bulkDeleteSubscribers: (ids) => apiClient.post('/subscribers/bulk-delete', { ids }),
  exportSubscribers: () => apiClient.get('/subscribers/export', { responseType: 'blob' }),

 // Media - Photos
  getPhotos: () => apiClient.get('/media/photos'),
  createPhoto: (data) => apiClient.post('/media/photos', data),
  deletePhoto: (id) => apiClient.delete(`/media/photos/${id}`),
  bulkDeletePhotos: (ids) => apiClient.post('/media/photos/bulk-delete', { ids }), // ← Add this

  // Media - Videos
  getVideos: () => apiClient.get('/media/videos'),
  createVideo: (data) => apiClient.post('/media/videos', data),
  deleteVideo: (id) => apiClient.delete(`/media/videos/${id}`),
  bulkDeleteVideos: (ids) => apiClient.post('/media/videos/bulk-delete', { ids }), // ← Add this

  // Image upload (for R2)
  uploadImage: (formData) => apiClient.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // Contact
  sendContact: (data) => apiClient.post('/contact', data),

  // Auth
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
   updateProfile: (data) => apiClient.put('/auth/update-profile', data),

    // Auth (Super Admin)
  getUsers: () => apiClient.get('/auth/users'),
  createUser: (data) => apiClient.post('/auth/users', data),
  deleteUser: (id) => apiClient.delete(`/auth/users/${id}`),
  updateUserRole: (id, role) => apiClient.put(`/auth/users/${id}/role`, { role }),
  getAuditLogs: () => apiClient.get('/auth/audit-logs'),

  
};

export default apiClient; 