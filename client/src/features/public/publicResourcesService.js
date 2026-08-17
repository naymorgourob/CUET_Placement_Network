import axiosInstance from '@/services/axiosInstance';

export async function getPublicResources(params) {
  const response = await axiosInstance.get('/resources', { params });
  return response.data.data;
}

export async function getFeaturedResource() {
  const response = await axiosInstance.get('/resources/featured');
  return response.data.data;
}

export async function getPublicResourceBySlug(slug) {
  const response = await axiosInstance.get(`/resources/${slug}`);
  return response.data.data;
}
