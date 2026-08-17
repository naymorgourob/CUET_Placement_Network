import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as adminService from '@/features/admin/adminService';

export const adminKeys = {
  dashboard: ['admin', 'dashboard'],
  recruiters: (status) => ['admin', 'recruiters', status],
  users: (params) => ['admin', 'users', params],
  jobs: (params) => ['admin', 'jobs', params],
  reports: (params) => ['admin', 'reports', params],
  resources: (params) => ['admin', 'resources', params],
  resource: (resourceId) => ['admin', 'resources', 'detail', resourceId],
};

export function useAdminDashboard() {
  return useQuery({ queryKey: adminKeys.dashboard, queryFn: adminService.getDashboard });
}

export function useAdminRecruiters(status) {
  return useQuery({ queryKey: adminKeys.recruiters(status), queryFn: () => adminService.getRecruiters({ status }) });
}

export function useVerifyRecruiter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.verifyRecruiter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'recruiters'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
    },
  });
}

export function useRejectRecruiter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.rejectRecruiter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'recruiters'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
    },
  });
}

export function useAdminUsers(params) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminService.getUsers(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.suspendUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useReactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.reactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useAdminJobs(params) {
  return useQuery({
    queryKey: adminKeys.jobs(params),
    queryFn: () => adminService.getJobsForModeration(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useRemoveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.removeJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
    },
  });
}

export function useAdminReports(params) {
  return useQuery({ queryKey: adminKeys.reports(params), queryFn: () => adminService.getReports(params) });
}

export function useAdminResources(params) {
  return useQuery({
    queryKey: adminKeys.resources(params),
    queryFn: () => adminService.getResources(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'resources'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'resources'] });
    },
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resourceId, payload }) => adminService.updateResource(resourceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'resources'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'resources'] });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'resources'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'resources'] });
    },
  });
}
