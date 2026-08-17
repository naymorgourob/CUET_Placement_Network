import { useQuery } from '@tanstack/react-query';
import { getPublicCompanies, getPublicCompanyDetails } from '@/features/public/publicCompaniesService';

export const publicCompanyKeys = {
  all: ['public', 'companies'],
  list: (params) => [...publicCompanyKeys.all, 'list', params],
  detail: (companyId) => [...publicCompanyKeys.all, 'detail', companyId],
};

export function usePublicCompanies(params) {
  return useQuery({
    queryKey: publicCompanyKeys.list(params),
    queryFn: () => getPublicCompanies(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });
}

export function usePublicCompanyDetails(companyId) {
  return useQuery({
    queryKey: publicCompanyKeys.detail(companyId),
    queryFn: () => getPublicCompanyDetails(companyId),
    enabled: Boolean(companyId),
    staleTime: 30_000,
  });
}
