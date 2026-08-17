import axiosInstance from '@/services/axiosInstance';

export async function getPublicCompanies(params) {
  const response = await axiosInstance.get('/companies', { params });
  return response.data.data;
}

export async function getPublicCompanyDetails(companyId) {
  const response = await axiosInstance.get(`/companies/${companyId}`);
  return response.data.data;
}
