import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data) => api.login(data),
    onSuccess: (response) => {
      const token = response.data.data.token;
      // Save token to localStorage
      localStorage.setItem('authToken', token);
      
      // Small delay to ensure token is saved before redirect
      // This helps prevent race conditions
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 100);
    },
  });
};
export const useLogout = () => {
  return () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };
};

export const useMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await api.getMe();
      return response.data.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    // Only run the query if we have a token
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('authToken'),
  });
};


// Change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => api.changePassword(data),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.updateProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};


// Super Admin only
export const useUsers = () => {
  return useQuery({
    queryKey: ['auth', 'users'],
    queryFn: async () => {
      const response = await api.getUsers();
      return response.data.data;
    },
    retry: false,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => api.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
    },
  });
};



// Bulk delete users (Super Admin only)
export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => api.bulkDeleteUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
    },
  });
};



// Get audit logs (Super Admin only)
export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['auth', 'audit-logs'],
    queryFn: async () => {
      const response = await api.getAuditLogs();
      return response.data.data;
    },
    retry: false,
  });
};