import axiosInstance from '@/services/axiosInstance';

export async function getMyProfile() {
  const response = await axiosInstance.get('/students/me');
  return response.data.data;
}

export async function updateMyProfile(payload) {
  const response = await axiosInstance.put('/students/me', payload);
  return response.data.data;
}

export async function getMyDashboard() {
  const response = await axiosInstance.get('/students/me/dashboard');
  return response.data.data;
}

export async function getMyApplications(params) {
  const response = await axiosInstance.get('/students/me/applications', { params });
  return response.data.data;
}

export async function getApplicationDetails(applicationId) {
  const response = await axiosInstance.get(`/applications/${applicationId}`);
  return response.data.data;
}

export async function getMyResumes() {
  const response = await axiosInstance.get('/resumes');
  return response.data.data;
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post('/resumes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export async function setCurrentResume(resumeId) {
  const response = await axiosInstance.patch(`/resumes/${resumeId}/set-current`);
  return response.data.data;
}

export async function deleteResume(resumeId) {
  const response = await axiosInstance.delete(`/resumes/${resumeId}`);
  return response.data.data;
}

export async function analyzeResume(resumeId) {
  const response = await axiosInstance.post(`/resumes/${resumeId}/analyze`);
  return response.data.data;
}

export async function getResumeAnalysis(resumeId) {
  const response = await axiosInstance.get(`/resumes/${resumeId}/analysis`);
  return response.data.data;
}

export async function generateResumeImprovementSuggestions(resumeId) {
  const response = await axiosInstance.post(`/resumes/${resumeId}/improvement-suggestions`);
  return response.data.data;
}

export async function getResumeImprovementSuggestions(resumeId) {
  const response = await axiosInstance.get(`/resumes/${resumeId}/improvement-suggestions`);
  return response.data.data;
}

export async function getJobs(params) {
  const response = await axiosInstance.get('/jobs', { params });
  return response.data.data;
}

export async function getJobDetails(jobId) {
  const response = await axiosInstance.get(`/jobs/${jobId}`);
  return response.data.data;
}

export async function applyToJob({ jobId, coverLetter }) {
  const response = await axiosInstance.post(`/jobs/${jobId}/applications`, { coverLetter });
  return response.data.data;
}

export async function generateJobMatch(jobId) {
  const response = await axiosInstance.post(`/jobs/${jobId}/match`);
  return response.data.data;
}

export async function getJobMatch(jobId) {
  const response = await axiosInstance.get(`/jobs/${jobId}/match`);
  return response.data.data;
}

export async function getSavedJobIds() {
  const response = await axiosInstance.get('/students/me/saved-jobs/ids');
  return response.data.data;
}

export async function getMySavedJobs() {
  const response = await axiosInstance.get('/students/me/saved-jobs');
  return response.data.data;
}

export async function saveJob(jobId) {
  const response = await axiosInstance.post(`/students/me/saved-jobs/${jobId}`);
  return response.data.data;
}

export async function unsaveJob(jobId) {
  const response = await axiosInstance.delete(`/students/me/saved-jobs/${jobId}`);
  return response.data.data;
}
