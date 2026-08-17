import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
  ExternalLink,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { useToast } from '@/hooks/useToast';
import { env } from '@/utils/env';
import {
  useJobDetails,
  useMyApplications,
  useMyResumes,
  useStudentProfile,
  useApplyToJob,
} from '@/features/student/studentQueries';

const JOB_TYPE_LABEL = {
  'full-time': 'Full Time',
  internship: 'Internship',
  'part-time': 'Part Time',
};

function JobSummaryCard({ job }) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <CompanyLogo name={job.Company?.name} logoPath={job.Company?.logoPath} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-text">{job.title}</h2>
            <p className="mt-0.5 truncate text-sm text-text-muted">{job.Company?.name ?? 'Unknown company'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-text-muted">
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {job.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            {JOB_TYPE_LABEL[job.jobType] ?? job.jobType}
          </span>
        </div>

        <Link to={`/student/jobs/${job.jobId}`}>
          <Button variant="outline" className="w-full">
            View Job Details
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
}

export function StudentApplyPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [submittedApplication, setSubmittedApplication] = useState(null);

  const { data: job, isLoading: isJobLoading, isError: isJobError, refetch: refetchJob } = useJobDetails(jobId);
  const { data: applicationsData, isLoading: isApplicationsLoading } = useMyApplications({ page: 1, limit: 100 });
  const { data: resumes, isLoading: isResumesLoading } = useMyResumes();
  const { data: profile, isLoading: isProfileLoading } = useStudentProfile();
  const applyToJob = useApplyToJob();

  const existingApplication = (applicationsData?.applications ?? []).find(
    (application) => String(application.jobId) === String(jobId)
  );

  const currentResume = (resumes ?? []).find((resume) => resume.resumeId === profile?.currentResumeId);

  const isLoading = isJobLoading || isApplicationsLoading || isResumesLoading || isProfileLoading;

  function handleSubmit() {
    applyToJob.mutate(
      { jobId, coverLetter: coverLetter.trim() || undefined },
      {
        onSuccess: (application) => {
          setSubmittedApplication(application);
        },
        onError: (error) => {
          const message = error.response?.data?.message ?? 'Unable to submit your application.';
          showToast({ variant: 'danger', title: 'Application failed', description: message });
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Skeleton className="h-4 w-16" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <Card>
            <CardBody>
              <SkeletonText lines={6} />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <SkeletonText lines={4} />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (isJobError || !job) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">
          {isJobError ? 'Unable to load this job.' : 'Job not found.'}
        </p>
        {isJobError ? (
          <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetchJob()}>
            Try Again
          </Button>
        ) : (
          <Link to="/student/jobs">
            <Button variant="outline">Back to Find Jobs</Button>
          </Link>
        )}
      </div>
    );
  }

  // Success state
  if (applyToJob.isSuccess && submittedApplication) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10"
        >
          <CheckCircle2 className="h-7 w-7 text-success" strokeWidth={1.75} aria-hidden="true" />
        </motion.div>
        <h1 className="text-xl font-semibold text-text">Application Submitted</h1>
        <p className="text-sm text-text-muted">
          Your application has been successfully submitted to {job.Company?.name ?? 'the company'}.
        </p>

        <Card className="w-full text-left">
          <CardBody className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Job Title</span>
              <span className="font-medium text-text">{job.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Company</span>
              <span className="font-medium text-text">{job.Company?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Submitted</span>
              <span className="font-medium text-text">
                {new Date(submittedApplication.applied_at ?? submittedApplication.createdAt ?? Date.now()).toLocaleString()}
              </span>
            </div>
          </CardBody>
        </Card>

        <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
          <Link to="/student/applications" className="flex-1">
            <Button className="w-full">View My Applications</Button>
          </Link>
          <Link to="/student/jobs" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue Browsing Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Already applied state
  if (existingApplication) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-7 w-7 text-success" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-text">Application already submitted</h1>
        <p className="text-sm text-text-muted">
          You've already applied for {job.title} at {job.Company?.name}.
        </p>

        <Card className="w-full text-left">
          <CardBody className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Applied on</span>
              <span className="font-medium text-text">
                {new Date(existingApplication.applied_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Status</span>
              <Badge variant="default" icon={null} className="capitalize">
                {existingApplication.status?.replace('_', ' ')}
              </Badge>
            </div>
          </CardBody>
        </Card>

        <Link to="/student/applications" className="w-full">
          <Button className="w-full">View My Applications</Button>
        </Link>
      </div>
    );
  }

  const hasResume = Boolean(currentResume);
  const resumeUrl = currentResume
    ? `${env.uploadBaseUrl}/${currentResume.filePath.replace(/^\/?/, '')}`
    : null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        type="button"
        onClick={() => navigate(-1)}
        className="flex w-fit items-center gap-1 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <h1 className="text-xl font-semibold text-text">Apply for this position</h1>
        <p className="mt-1 text-sm text-text-muted">Review your details before submitting your application.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
        {/* LEFT / MAIN */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-text">Your Resume</h2>

              {!hasResume ? (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-8 text-center">
                  <FileText className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-text">Your application is missing a resume.</p>
                    <p className="mt-1 text-xs text-text-muted">Upload a resume before applying.</p>
                  </div>
                  <Link to="/student/resumes">
                    <Button variant="outline">Go to My Resume</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">{currentResume.originalFileName}</p>
                      <p className="text-xs text-text-muted">
                        Uploaded {new Date(currentResume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <a href={resumeUrl} target="_blank" rel="noreferrer" className="shrink-0">
                    <Button variant="outline" size="sm" rightIcon={ExternalLink}>
                      View Resume
                    </Button>
                  </a>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-col gap-3">
              <Textarea
                label="Cover Letter (Optional)"
                rows={7}
                placeholder="Introduce yourself and briefly explain why you're interested in this position..."
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                maxLength={3000}
              />
              <p className="text-right text-xs text-text-muted">{coverLetter.length}/3000</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-text">Application Review</h2>

              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <p className="text-text-muted">Applying for</p>
                  <p className="mt-0.5 font-medium text-text">{job.title}</p>
                  <p className="text-text-muted">{job.Company?.name}</p>
                </div>
                <div>
                  <p className="text-text-muted">Resume</p>
                  <p className="mt-0.5 font-medium text-text">
                    {hasResume ? currentResume.originalFileName : 'No resume on file'}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Cover Letter</p>
                  <p className="mt-0.5 font-medium text-text">{coverLetter.trim() ? 'Added' : 'Not added'}</p>
                </div>
              </div>

              {applyToJob.isError && (
                <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                  <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span>{applyToJob.error?.response?.data?.message ?? 'Unable to submit your application.'}</span>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                isLoading={applyToJob.isPending}
                disabled={applyToJob.isPending || !hasResume}
                className="w-full"
              >
                {applyToJob.isPending ? 'Submitting application...' : 'Submit Application'}
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* RIGHT / SUMMARY */}
        <div className="lg:sticky lg:top-6">
          <JobSummaryCard job={job} />
        </div>
      </div>
    </div>
  );
}
