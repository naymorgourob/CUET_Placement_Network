import axiosInstance from '@/services/axiosInstance';

export async function getDashboard() {
  const response = await axiosInstance.get('/admin/dashboard');
  return response.data.data;
}

export async function getRecruiters(params) {
  const response = await axiosInstance.get('/admin/recruiters', { params });
  return response.data.data;
}

export async function verifyRecruiter(recruiterProfileId) {
  const response = await axiosInstance.patch(`/admin/recruiters/${recruiterProfileId}/verify`);
  return response.data.data;
}

export async function rejectRecruiter(recruiterProfileId) {
  const response = await axiosInstance.patch(`/admin/recruiters/${recruiterProfileId}/reject`);
  return response.data.data;
}

export async function getUsers(params) {
  const response = await axiosInstance.get('/admin/users', { params });
  return response.data.data;
}

export async function suspendUser(userId) {
  const response = await axiosInstance.patch(`/admin/users/${userId}/suspend`);
  return response.data.data;
}

export async function reactivateUser(userId) {
  const response = await axiosInstance.patch(`/admin/users/${userId}/reactivate`);
  return response.data.data;
}

export async function getJobsForModeration(params) {
  const response = await axiosInstance.get('/admin/jobs', { params });
  return response.data.data;
}

export async function removeJob(jobId) {
  const response = await axiosInstance.patch(`/admin/jobs/${jobId}/remove`);
  return response.data.data;
}

export async function getReports(params) {
  const response = await axiosInstance.get('/admin/reports', { params });
  return response.data.data;
}

export async function exportReports(params) {
  const response = await axiosInstance.get('/admin/reports/export', { params });
  return response.data.data;
}

export async function getResources(params) {
  const response = await axiosInstance.get('/admin/resources', { params });
  return response.data.data;
}

export async function getResourceById(resourceId) {
  const response = await axiosInstance.get(`/admin/resources/${resourceId}`);
  return response.data.data;
}

export async function createResource(payload) {
  const response = await axiosInstance.post('/admin/resources', payload);
  return response.data.data;
}

export async function updateResource(resourceId, payload) {
  const response = await axiosInstance.put(`/admin/resources/${resourceId}`, payload);
  return response.data.data;
}

export async function deleteResource(resourceId) {
  const response = await axiosInstance.delete(`/admin/resources/${resourceId}`);
  return response.data.data;
}
