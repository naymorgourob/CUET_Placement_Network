import axiosInstance from '@/services/axiosInstance';

export async function getMyProfile() {
  const response = await axiosInstance.get('/recruiters/me');
  return response.data.data;
}

export async function updateMyProfile(payload) {
  const response = await axiosInstance.put('/recruiters/me', payload);
  return response.data.data;
}

export async function getMyDashboard() {
  const response = await axiosInstance.get('/recruiters/me/dashboard');
  return response.data.data;
}

export async function getMyCompany() {
  const response = await axiosInstance.get('/company/me');
  return response.data.data;
}

export async function updateMyCompany(payload) {
  const response = await axiosInstance.put('/company/me', payload);
  return response.data.data;
}

export async function uploadCompanyLogo(file) {
  const formData = new FormData();
  formData.append('logo', file);
  const response = await axiosInstance.put('/company/me/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export async function getMyJobs() {
  const response = await axiosInstance.get('/recruiters/me/jobs');
  return response.data.data;
}

export async function getMyApplications(params) {
  const response = await axiosInstance.get('/recruiters/me/applications', { params });
  return response.data.data;
}

export async function getJobDetails(jobId) {
  const response = await axiosInstance.get(`/jobs/${jobId}`);
  return response.data.data;
}

export async function createJob(payload) {
  const response = await axiosInstance.post('/jobs', payload);
  return response.data.data;
}

export async function updateJob({ jobId, payload }) {
  const response = await axiosInstance.put(`/jobs/${jobId}`, payload);
  return response.data.data;
}

export async function closeJob(jobId) {
  const response = await axiosInstance.patch(`/jobs/${jobId}/close`);
  return response.data.data;
}

export async function deleteJob(jobId) {
  const response = await axiosInstance.delete(`/jobs/${jobId}`);
  return response.data.data;
}

export async function getApplicantsForJob(jobId, params) {
  const response = await axiosInstance.get(`/jobs/${jobId}/applicants`, { params });
  return response.data.data;
}

export async function getApplicationDetails(applicationId) {
  const response = await axiosInstance.get(`/applications/${applicationId}`);
  return response.data.data;
}

export async function updateApplicationStatus({ applicationId, status }) {
  const response = await axiosInstance.patch(`/applications/${applicationId}/status`, { status });
  return response.data.data;
}

export async function getApplicantMatch(applicationId) {
  const response = await axiosInstance.get(`/applications/${applicationId}/match`);
  return response.data.data;
}

export async function generateApplicantMatch(applicationId) {
  const response = await axiosInstance.post(`/applications/${applicationId}/match`);
  return response.data.data;
}
