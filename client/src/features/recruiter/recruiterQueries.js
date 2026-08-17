import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as recruiterService from '@/features/recruiter/recruiterService';

export const recruiterKeys = {
  profile: ['recruiter', 'profile'],
  dashboard: ['recruiter', 'dashboard'],
  company: ['recruiter', 'company'],
  jobs: ['recruiter', 'jobs'],
  jobDetail: (jobId) => ['recruiter', 'jobs', jobId],
  applications: (params) => ['recruiter', 'applications', params],
  applicants: (jobId, params) => ['recruiter', 'jobs', jobId, 'applicants', params],
  applicationDetail: (applicationId) => ['recruiter', 'applications', applicationId],
  applicantMatch: (applicationId) => ['recruiter', 'applications', applicationId, 'match'],
};

export function useRecruiterProfile() {
  return useQuery({ queryKey: recruiterKeys.profile, queryFn: recruiterService.getMyProfile });
}

export function useUpdateRecruiterProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruiterService.updateMyProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(recruiterKeys.profile, updatedProfile);
      queryClient.invalidateQueries({ queryKey: recruiterKeys.dashboard });
    },
  });
}

export function useRecruiterDashboard() {
  return useQuery({ queryKey: recruiterKeys.dashboard, queryFn: recruiterService.getMyDashboard });
}

export function useCompanyProfile() {
  return useQuery({ queryKey: recruiterKeys.company, queryFn: recruiterService.getMyCompany, retry: false });
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruiterService.updateMyCompany,
    onSuccess: (updatedCompany) => {
      queryClient.setQueryData(recruiterKeys.company, updatedCompany);
      queryClient.invalidateQueries({ queryKey: recruiterKeys.dashboard });
    },
  });
}

export function useUploadCompanyLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruiterService.uploadCompanyLogo,
    onSuccess: (updatedCompany) => {
      queryClient.setQueryData(recruiterKeys.company, updatedCompany);
      queryClient.invalidateQueries({ queryKey: recruiterKeys.dashboard });
    },
  });
}

export function useMyJobs() {
  return useQuery({ queryKey: recruiterKeys.jobs, queryFn: recruiterService.getMyJobs });
}

export function useMyApplications(params) {
  return useQuery({
    queryKey: recruiterKeys.applications(params),
    queryFn: () => recruiterService.getMyApplications(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useJobDetails(jobId) {
  return useQuery({
    queryKey: recruiterKeys.jobDetail(jobId),
    queryFn: () => recruiterService.getJobDetails(jobId),
    enabled: Boolean(jobId),
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruiterService.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterKeys.jobs });
      queryClient.invalidateQueries({ queryKey: recruiterKeys.dashboard });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruiterService.updateJob,
    onSuccess: (updatedJob) => {
      queryClient.invalidateQueries({ queryKey: recruiterKeys.jobs });
      queryClient.setQueryData(recruiterKeys.jobDetail(updatedJob.jobId), updatedJob);
    },
  });
}

export function useCloseJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruiterService.closeJob,
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: recruiterKeys.jobs });
      const previousJobs = queryClient.getQueryData(recruiterKeys.jobs);

      queryClient.setQueryData(recruiterKeys.jobs, (current) =>
        current?.map((job) => (job.jobId === jobId ? { ...job, status: 'closed' } : job))
      );

      return { previousJobs };
    },
    onError: (error, jobId, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(recruiterKeys.jobs, context.previousJobs);
      }
    },
    onSettled: (data, error, jobId) => {
      queryClient.invalidateQueries({ queryKey: recruiterKeys.jobs });
      queryClient.invalidateQueries({ queryKey: recruiterKeys.jobDetail(jobId) });
      queryClient.invalidateQueries({ queryKey: recruiterKeys.dashboard });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruiterService.deleteJob,
    onSettled: (data, error, jobId) => {
      queryClient.invalidateQueries({ queryKey: recruiterKeys.jobs });
      queryClient.invalidateQueries({ queryKey: recruiterKeys.jobDetail(jobId) });
      queryClient.invalidateQueries({ queryKey: recruiterKeys.dashboard });
    },
  });
}

export function useApplicantsForJob(jobId, params) {
  return useQuery({
    queryKey: recruiterKeys.applicants(jobId, params),
    queryFn: () => recruiterService.getApplicantsForJob(jobId, params),
    enabled: Boolean(jobId),
    placeholderData: (previousData) => previousData,
  });
}

export function useApplicationDetails(applicationId) {
  return useQuery({
    queryKey: recruiterKeys.applicationDetail(applicationId),
    queryFn: () => recruiterService.getApplicationDetails(applicationId),
    enabled: Boolean(applicationId),
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruiterService.updateApplicationStatus,
    onMutate: async ({ applicationId, status }) => {
      await queryClient.cancelQueries({ queryKey: recruiterKeys.applicationDetail(applicationId) });
      const previousDetail = queryClient.getQueryData(recruiterKeys.applicationDetail(applicationId));

      queryClient.setQueryData(recruiterKeys.applicationDetail(applicationId), (current) =>
        current ? { ...current, status } : current
      );

      return { previousDetail, applicationId };
    },
    onError: (error, variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(recruiterKeys.applicationDetail(context.applicationId), context.previousDetail);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: recruiterKeys.applicationDetail(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'jobs'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'applications'] });
      queryClient.invalidateQueries({ queryKey: recruiterKeys.dashboard });
    },
  });
}

export function useApplicantMatch(applicationId, options = {}) {
  return useQuery({
    queryKey: recruiterKeys.applicantMatch(applicationId),
    queryFn: () => recruiterService.getApplicantMatch(applicationId),
    enabled: Boolean(applicationId) && (options.enabled ?? true),
    retry: false,
  });
}

export function useGenerateApplicantMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recruiterService.generateApplicantMatch,
    onSuccess: (match, applicationId) => {
      queryClient.setQueryData(recruiterKeys.applicantMatch(applicationId), match);
    },
  });
}
