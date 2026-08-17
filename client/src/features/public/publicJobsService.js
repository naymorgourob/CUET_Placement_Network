import axiosInstance from '@/services/axiosInstance';

export async function getPublicJobs(params) {
  const response = await axiosInstance.get('/jobs', { params: { status: 'open', ...params } });
  return response.data.data;
}

export async function getPublicJobDetails(jobId) {
  const response = await axiosInstance.get(`/jobs/${jobId}`);
  return response.data.data;
}
