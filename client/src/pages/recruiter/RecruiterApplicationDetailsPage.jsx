import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  CheckCircle2,
  XCircle,
  Trophy,
  ExternalLink,
  Download,
  MapPin,
  Briefcase,
  Building2,
  AlertTriangle,
  RefreshCcw,
  SearchX,
} from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ApplicationStatusBadge } from '@/features/student/components/ApplicationStatusBadge';
import { JobStatusBadge } from '@/features/recruiter/components/JobStatusBadge';
import { useToast } from '@/hooks/useToast';
import { useApplicationDetails, useUpdateApplicationStatus } from '@/features/recruiter/recruiterQueries';
import { env } from '@/utils/env';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

const TERMINAL_STATUSES = ['rejected', 'selected'];

const JOB_TYPE_LABEL = {
  'full-time': 'Full-time',
  internship: 'Internship',
  'part-time': 'Part-time',
};

const ACTION_CONFIG = {
  shortlisted: {
    label: 'Shortlist',
    toastTitle: 'Applicant shortlisted.',
    dialogTitle: 'Shortlist this applicant?',
    dialogDescription: 'The candidate will be marked as shortlisted for this job.',
    variant: 'primary',
    icon: CheckCircle2,
  },
  selected: {
    label: 'Select',
    toastTitle: 'Applicant selected.',
    dialogTitle: 'Select this applicant?',
    dialogDescription: 'The candidate will be marked as selected for this job. This cannot be undone.',
    variant: 'primary',
    icon: Trophy,
  },
  rejected: {
    label: 'Reject',
    toastTitle: 'Applicant rejected.',
    dialogTitle: 'Reject this application?',
    dialogDescription: 'This candidate will be marked as rejected. This cannot be undone.',
    variant: 'destructive',
    icon: XCircle,
  },
};

function parseSkills(skills) {
  if (!skills) return [];
  return skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function resumeUrl(resume) {
  return `${env.uploadBaseUrl}/${resume.filePath.replace(/^\/?/, '')}`;
}

export function RecruiterApplicationDetailsPage() {
  const { applicationId } = useParams();
  const [pendingAction, setPendingAction] = useState(null);
  const { showToast } = useToast();

  const { data: application, isLoading, isError, error, refetch } = useApplicationDetails(applicationId);
  const updateStatus = useUpdateApplicationStatus();

  function handleConfirmAction() {
    if (!pendingAction || updateStatus.isPending) return;
    updateStatus.mutate(
      { applicationId, status: pendingAction },
      {
        onSuccess: () => {
          showToast({
            variant: 'success',
            title: 'Application status updated successfully.',
          });
          setPendingAction(null);
        },
        onError: (updateError) => {
          const message = updateError.response?.data?.message ?? 'Failed to update application status.';
          showToast({ variant: 'danger', title: 'Unable to update application status.', description: message });
          setPendingAction(null);
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    const status = error?.response?.status;
    const isNotFound = status === 404 || status === 403;

    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        {isNotFound ? (
          <>
            <SearchX className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm font-semibold text-text">Application not found.</p>
          </>
        ) : (
          <>
            <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm font-semibold text-text">Unable to load candidate information.</p>
          </>
        )}
        {isNotFound ? (
          <Link to="/recruiter/applications">
            <Button variant="outline" leftIcon={ArrowLeft}>
              Back to Applications
            </Button>
          </Link>
        ) : (
          <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetch()}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  const isTerminal = TERMINAL_STATUSES.includes(application.status);
  const student = application.StudentProfile;
  const user = student?.User;
  const job = application.Job;
  const company = job?.Company;
  const skills = parseSkills(student?.skills);

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/recruiter/applications"
        className="flex w-fit items-center gap-1 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        Back to Applications
      </Link>

      <motion.div {...fadeUp}>
        <Card>
          <CardBody className="flex flex-wrap items-start justify-between gap-4 p-6">
            <div className="flex items-center gap-4">
              <Avatar name={user?.fullName} size="lg" />
              <div>
                <h1 className="text-lg font-semibold text-text">{user?.fullName}</h1>
                <p className="mt-0.5 text-sm text-text-muted">
                  Applied for <span className="font-medium text-text">{job?.title}</span>
                  {company ? ` at ${company.name}` : ''}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Applied {new Date(application.applied_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <ApplicationStatusBadge status={application.status} />
              {!isTerminal && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={XCircle}
                    disabled={updateStatus.isPending}
                    onClick={() => setPendingAction('rejected')}
                  >
                    Reject
                  </Button>
                  {application.status !== 'shortlisted' && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={CheckCircle2}
                      disabled={updateStatus.isPending}
                      onClick={() => setPendingAction('shortlisted')}
                    >
                      Shortlist
                    </Button>
                  )}
                  {application.status === 'shortlisted' && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={Trophy}
                      disabled={updateStatus.isPending}
                      onClick={() => setPendingAction('selected')}
                    >
                      Select
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>Candidate Overview</CardTitle>
              </CardHeader>
              <CardBody className="flex flex-col gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {user?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
                      <span className="truncate text-text">{user.email}</span>
                    </div>
                  )}
                  {student?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
                      <span className="text-text">{student.phone}</span>
                    </div>
                  )}
                  {student?.department && (
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
                      <span className="text-text">
                        {student.department}
                        {student.batchYear ? ` · Batch ${student.batchYear}` : ''}
                      </span>
                    </div>
                  )}
                  {student?.cgpa && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-text-muted">CGPA:</span>
                      <span className="text-text">{student.cgpa}</span>
                    </div>
                  )}
                </div>

                {skills.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium text-text">Skills</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-muted"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          <motion.div {...fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
              </CardHeader>
              <CardBody>
                {application.Resume ? (
                  <div className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <FileText className="h-5 w-5 shrink-0 text-danger" strokeWidth={1.75} aria-hidden="true" />
                      <span className="truncate text-sm font-medium text-text">
                        {application.Resume.originalFileName}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <a href={resumeUrl(application.Resume)} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" leftIcon={ExternalLink}>
                          View
                        </Button>
                      </a>
                      <a href={resumeUrl(application.Resume)} download={application.Resume.originalFileName}>
                        <Button variant="outline" size="sm" leftIcon={Download}>
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">No resume on file for this application.</p>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {application.coverLetter && (
            <motion.div {...fadeUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardBody>
                  <p className="whitespace-pre-wrap text-sm text-text-secondary">{application.coverLetter}</p>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardBody className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Status</span>
                  <ApplicationStatusBadge status={application.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Applied</span>
                  <span className="text-text">{new Date(application.applied_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Cover Letter</span>
                  <span className="text-text">{application.coverLetter ? 'Available' : 'Not submitted'}</span>
                </div>
                {application.updatedAt && application.updatedAt !== application.applied_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Last Updated</span>
                    <span className="text-text">{new Date(application.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          <motion.div {...fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>Job</CardTitle>
              </CardHeader>
              <CardBody className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <CompanyLogo name={company?.name} logoPath={company?.logoPath} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">{job?.title}</p>
                    <p className="truncate text-xs text-text-muted">{company?.name}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-text-muted">
                  {job?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      {job.location}
                    </span>
                  )}
                  {job?.jobType && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      {JOB_TYPE_LABEL[job.jobType] ?? job.jobType}
                    </span>
                  )}
                  {company?.industry && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      {company.industry}
                    </span>
                  )}
                </div>
                {job?.status && (
                  <div>
                    <JobStatusBadge status={job.status} />
                  </div>
                )}
                <Link to={`/recruiter/jobs/${job?.jobId}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Job
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => !open && !updateStatus.isPending && setPendingAction(null)}
        title={pendingAction ? ACTION_CONFIG[pendingAction].dialogTitle : ''}
        description={pendingAction ? ACTION_CONFIG[pendingAction].dialogDescription : ''}
        confirmLabel={pendingAction ? ACTION_CONFIG[pendingAction].label : ''}
        variant={pendingAction ? ACTION_CONFIG[pendingAction].variant : 'primary'}
        isLoading={updateStatus.isPending}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
