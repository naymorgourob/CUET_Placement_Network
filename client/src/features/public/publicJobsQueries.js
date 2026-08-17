import { useQuery } from '@tanstack/react-query';
import { getPublicJobs, getPublicJobDetails } from '@/features/public/publicJobsService';

export const publicJobKeys = {
  all: ['public', 'jobs'],
  list: (params) => [...publicJobKeys.all, 'list', params],
  detail: (jobId) => [...publicJobKeys.all, 'detail', jobId],
};

export function usePublicJobs(params) {
  return useQuery({
    queryKey: publicJobKeys.list(params),
    queryFn: () => getPublicJobs(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });
}

export function usePublicJobDetails(jobId) {
  return useQuery({
    queryKey: publicJobKeys.detail(jobId),
    queryFn: () => getPublicJobDetails(jobId),
    enabled: Boolean(jobId),
    staleTime: 30_000,
  });
}
