import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as notificationService from '@/features/notifications/notificationService';

export const notificationKeys = {
  list: (params) => ['notifications', 'list', params],
  unreadCount: ['notifications', 'unreadCount'],
};

export function useNotifications(params) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationService.getNotifications(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 60 * 1000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
