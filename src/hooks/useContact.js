import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useSendContact = () => {
  return useMutation({
    mutationFn: (data) => api.sendContact(data),
  });
};