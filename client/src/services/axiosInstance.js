import axios from 'axios';
import { env } from '@/utils/env';
import { tokenStorage } from '@/utils/tokenStorage';

export const UNAUTHORIZED_EVENT = 'cuet:unauthorized';

const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
