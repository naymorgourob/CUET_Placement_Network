import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as studentService from '@/features/student/studentService';

export const studentKeys = {
  profile: ['student', 'profile'],
  dashboard: ['student', 'dashboard'],
  applications: (params) => ['student', 'applications', params],
  applicationDetail: (applicationId) => ['student', 'applications', applicationId],
  resumes: ['student', 'resumes'],
  resumeAnalysis: (resumeId) => ['student', 'resumes', resumeId, 'analysis'],
  resumeImprovementSuggestions: (resumeId) => ['student', 'resumes', resumeId, 'improvement-suggestions'],
};

export const jobKeys = {
  list: (params) => ['jobs', 'list', params],
  detail: (jobId) => ['jobs', 'detail', jobId],
  match: (jobId) => ['jobs', 'match', jobId],
};

export const savedJobKeys = {
  ids: ['student', 'saved-jobs', 'ids'],
  list: ['student', 'saved-jobs', 'list'],
};

export function useStudentProfile() {
  return useQuery({
    queryKey: studentKeys.profile,
    queryFn: studentService.getMyProfile,
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.updateMyProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(studentKeys.profile, updatedProfile);
      queryClient.invalidateQueries({ queryKey: studentKeys.dashboard });
    },
  });
}

export function useStudentDashboard(options = {}) {
  return useQuery({
    queryKey: studentKeys.dashboard,
    queryFn: studentService.getMyDashboard,
    enabled: options.enabled ?? true,
  });
}

export function useMyApplications(params) {
  return useQuery({
    queryKey: studentKeys.applications(params),
    queryFn: () => studentService.getMyApplications(params),
  });
}

export function useApplicationDetails(applicationId) {
  return useQuery({
    queryKey: studentKeys.applicationDetail(applicationId),
    queryFn: () => studentService.getApplicationDetails(applicationId),
    enabled: Boolean(applicationId),
  });
}

export function useMyResumes() {
  return useQuery({
    queryKey: studentKeys.resumes,
    queryFn: studentService.getMyResumes,
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.resumes });
      queryClient.invalidateQueries({ queryKey: studentKeys.profile });
      queryClient.invalidateQueries({ queryKey: studentKeys.dashboard });
    },
  });
}

export function useSetCurrentResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.setCurrentResume,
    onMutate: async (resumeId) => {
      await queryClient.cancelQueries({ queryKey: studentKeys.resumes });
      const previousResumes = queryClient.getQueryData(studentKeys.resumes);

      queryClient.setQueryData(studentKeys.resumes, (current) =>
        current?.map((resume) => ({ ...resume, isCurrentOptimistic: resume.resumeId === resumeId }))
      );

      return { previousResumes };
    },
    onError: (error, resumeId, context) => {
      if (context?.previousResumes) {
        queryClient.setQueryData(studentKeys.resumes, context.previousResumes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.resumes });
      queryClient.invalidateQueries({ queryKey: studentKeys.profile });
      queryClient.invalidateQueries({ queryKey: studentKeys.dashboard });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.resumes });
      queryClient.invalidateQueries({ queryKey: studentKeys.profile });
      queryClient.invalidateQueries({ queryKey: studentKeys.dashboard });
    },
  });
}

export function useResumeAnalysis(resumeId, options = {}) {
  return useQuery({
    queryKey: studentKeys.resumeAnalysis(resumeId),
    queryFn: () => studentService.getResumeAnalysis(resumeId),
    enabled: Boolean(resumeId) && (options.enabled ?? true),
    retry: false,
  });
}

export function useAnalyzeResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.analyzeResume,
    onSuccess: (analysis, resumeId) => {
      queryClient.setQueryData(studentKeys.resumeAnalysis(resumeId), analysis);
    },
  });
}

export function useResumeImprovementSuggestions(resumeId, options = {}) {
  return useQuery({
    queryKey: studentKeys.resumeImprovementSuggestions(resumeId),
    queryFn: () => studentService.getResumeImprovementSuggestions(resumeId),
    enabled: Boolean(resumeId) && (options.enabled ?? true),
    retry: false,
  });
}

export function useGenerateResumeImprovementSuggestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.generateResumeImprovementSuggestions,
    onSuccess: (suggestions, resumeId) => {
      queryClient.setQueryData(studentKeys.resumeImprovementSuggestions(resumeId), suggestions);
    },
  });
}

export function useJobs(params) {
  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => studentService.getJobs(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useJobDetails(jobId) {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => studentService.getJobDetails(jobId),
    enabled: Boolean(jobId),
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.applyToJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'applications'] });
      queryClient.invalidateQueries({ queryKey: studentKeys.dashboard });
    },
  });
}

export function useJobMatch(jobId, options = {}) {
  return useQuery({
    queryKey: jobKeys.match(jobId),
    queryFn: () => studentService.getJobMatch(jobId),
    enabled: Boolean(jobId) && (options.enabled ?? true),
    retry: false,
  });
}

export function useGenerateJobMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.generateJobMatch,
    onSuccess: (match, jobId) => {
      queryClient.setQueryData(jobKeys.match(jobId), match);
    },
  });
}

export function useSavedJobIds() {
  return useQuery({
    queryKey: savedJobKeys.ids,
    queryFn: studentService.getSavedJobIds,
  });
}

export function useMySavedJobs() {
  return useQuery({
    queryKey: savedJobKeys.list,
    queryFn: studentService.getMySavedJobs,
  });
}

function useToggleSavedJob(mutationFn) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: savedJobKeys.ids });
      const previousIds = queryClient.getQueryData(savedJobKeys.ids);

      queryClient.setQueryData(savedJobKeys.ids, (current = []) =>
        mutationFn === studentService.saveJob
          ? Array.from(new Set([...current, jobId]))
          : current.filter((id) => id !== jobId)
      );

      return { previousIds };
    },
    onError: (error, jobId, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(savedJobKeys.ids, context.previousIds);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: savedJobKeys.ids });
      queryClient.invalidateQueries({ queryKey: savedJobKeys.list });
    },
  });
}

export function useSaveJob() {
  return useToggleSavedJob(studentService.saveJob);
}

export function useUnsaveJob() {
  return useToggleSavedJob(studentService.unsaveJob);
}
