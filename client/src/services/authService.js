import axiosInstance from '@/services/axiosInstance';

export async function login(email, password) {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data.data;
}

export async function register({ fullName, email, password, role }) {
  const response = await axiosInstance.post('/auth/register', { fullName, email, password, role });
  return response.data.data;
}

export async function logout() {
  const response = await axiosInstance.post('/auth/logout');
  return response.data.data;
}

export async function getCurrentUser() {
  const response = await axiosInstance.get('/auth/me');
  return response.data.data;
}

export async function changePassword({ currentPassword, newPassword }) {
  const response = await axiosInstance.post('/auth/change-password', { currentPassword, newPassword });
  return response.data.data;
}
