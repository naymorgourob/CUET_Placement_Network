import axiosInstance from '@/services/axiosInstance';

export async function getNotifications(params) {
  const response = await axiosInstance.get('/notifications', { params });
  return response.data.data;
}

export async function getUnreadCount() {
  const response = await axiosInstance.get('/notifications/unread-count');
  return response.data.data;
}

export async function markAsRead(notificationId) {
  const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
  return response.data.data;
}

export async function markAllAsRead() {
  const response = await axiosInstance.patch('/notifications/read-all');
  return response.data.data;
}
