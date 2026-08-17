import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  CheckCircle2,
  Star,
  Trophy,
  Building2,
  ArrowRight,
  ArrowUpRight,
  Inbox,
  FileText,
  ShieldAlert,
  MapPin,
  Plus,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { JobStatusBadge } from '@/features/recruiter/components/JobStatusBadge';
import { ApplicationStatusBadge } from '@/features/student/components/ApplicationStatusBadge';
import { formatRelativeTime } from '@/utils/formatRelativeTime';
import { useAuth } from '@/hooks/useAuth';
import { useRecruiterDashboard, useMyJobs } from '@/features/recruiter/recruiterQueries';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

const JOB_TYPE_LABEL = {
  'full-time': 'Full Time',
  internship: 'Internship',
  'part-time': 'Part Time',
};

function greetingForHour(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function StatTile({ icon: Icon, label, value, isLoading }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3.5 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-muted">{label}</p>
          {isLoading ? (
            <Skeleton className="mt-1.5 h-6 w-10" />
          ) : (
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-text">{value}</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function ActiveJobRow({ job }) {
  return (
    <Link
      to={`/recruiter/jobs/${job.jobId}`}
      className="group flex min-w-0 items-center gap-4 rounded-lg border border-border p-4 transition-colors duration-100 hover:border-border-strong hover:bg-surface-muted"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-text group-hover:text-primary">{job.title}</p>
          <JobStatusBadge status={job.status} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="default" icon={null} className="text-[11px]">
            {JOB_TYPE_LABEL[job.jobType] ?? job.jobType}
          </Badge>
          {job.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted">
              <MapPin className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
              {job.location}
            </span>
          )}
          <span className="text-[11px] font-medium text-text-muted">
            {job.applicationCount} {job.applicationCount === 1 ? 'application' : 'applications'}
          </span>
        </div>
      </div>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-text-muted opacity-0 transition-opacity duration-100 group-hover:opacity-100"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </Link>
  );
}

function PipelineStage({ label, value, isLast }) {
  return (
    <div className="flex flex-1 items-center gap-2">
      <div className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-border px-3 py-3 text-center">
        <p className="text-lg font-semibold text-text">{value}</p>
        <p className="text-[11px] font-medium text-text-muted">{label}</p>
      </div>
      {!isLast && <ArrowRight className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.75} aria-hidden="true" />}
    </div>
  );
}

export function RecruiterDashboardPage() {
  const { user } = useAuth();
  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useRecruiterDashboard();
  const { data: jobs, isLoading: isJobsLoading, isError: isJobsError, refetch: refetchJobs } = useMyJobs();

  if (isDashboardError && isJobsError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">Unable to load dashboard data.</p>
        <Button
          variant="outline"
          leftIcon={RefreshCcw}
          onClick={() => {
            refetchDashboard();
            refetchJobs();
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const firstName = user?.fullName?.split(' ')[0] ?? 'there';
  const greeting = greetingForHour(new Date().getHours());
  const company = dashboard?.companyProfile;
  const stats = dashboard?.applicationStats;
  const recentApplications = dashboard?.recentApplications ?? [];
  const activeJobs = (jobs ?? []).filter((job) => job.status === 'open').slice(0, 5);

  const hasPipelineData = !isDashboardLoading && stats && stats.totalApplications > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome header */}
      <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-text">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-text-muted">Here's what's happening with your hiring activity.</p>
          {!isDashboardLoading && company && (
            <div className="mt-2 flex items-center gap-2">
              <CompanyLogo name={company.name} logoPath={company.logoPath} size="sm" />
              <span className="text-sm font-medium text-text-secondary">{company.name}</span>
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link to="/recruiter/applications">
            <Button variant="outline">View Applications</Button>
          </Link>
          <Link to="/recruiter/jobs/new">
            <Button leftIcon={Plus}>Post a Job</Button>
          </Link>
        </div>
      </motion.div>

      {!isDashboardLoading && dashboard && !dashboard.isVerified && (
        <motion.div {...fadeUp}>
          <Card className="border-warning/40">
            <CardBody className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-text">Your recruiter account is not verified yet</p>
                <p className="mt-1 text-sm text-text-muted">
                  An admin needs to verify your account before you can post jobs. This may take some time.
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Quick statistics */}
      <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Briefcase} label="Active Jobs" value={dashboard?.activeJobs ?? 0} isLoading={isDashboardLoading} />
        <StatTile
          icon={Inbox}
          label="Total Applications"
          value={stats?.totalApplications ?? 0}
          isLoading={isDashboardLoading}
        />
        <StatTile icon={Star} label="Shortlisted" value={stats?.shortlisted ?? 0} isLoading={isDashboardLoading} />
        <StatTile icon={Trophy} label="Hired / Selected" value={stats?.selected ?? 0} isLoading={isDashboardLoading} />
      </motion.div>

      {hasPipelineData && (
        <motion.div {...fadeUp} className="min-w-0">
          <Card>
            <div className="border-b border-border p-6 pb-4">
              <h2 className="text-base font-semibold text-text">Hiring Pipeline</h2>
            </div>
            <CardBody>
              <div className="flex flex-col items-stretch gap-2 sm:flex-row">
                <PipelineStage label="Applications" value={stats.totalApplications} />
                <PipelineStage label="Under Review" value={stats.underReview} />
                <PipelineStage label="Shortlisted" value={stats.shortlisted} />
                <PipelineStage label="Selected" value={stats.selected} isLast />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <motion.div {...fadeUp} className="min-w-0">
          <Card>
            <div className="flex items-center justify-between gap-3 border-b border-border p-6 pb-4">
              <h2 className="text-base font-semibold text-text">Recent Applications</h2>
              <Link
                to="/recruiter/applications"
                className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
            <CardBody className="flex flex-col gap-3">
              {isDashboardLoading ? (
                Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-16 w-full rounded-lg" />)
              ) : recentApplications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <FileText className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-sm font-medium text-text">No applications yet.</p>
                  <p className="text-sm text-text-muted">Applications will appear here when students apply to your jobs.</p>
                  <Link to="/recruiter/jobs" className="mt-1">
                    <Button variant="outline" size="sm">
                      View My Jobs
                    </Button>
                  </Link>
                </div>
              ) : (
                recentApplications.map((application) => {
                  const candidateName = application.StudentProfile?.User?.fullName ?? 'Unknown candidate';
                  return (
                    <Link
                      key={application.applicationId}
                      to={`/recruiter/applications/${application.applicationId}`}
                      className="flex min-w-0 items-center gap-3 rounded-lg border border-border p-3 transition-colors duration-100 hover:border-border-strong hover:bg-surface-muted"
                    >
                      <Avatar name={candidateName} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text">{candidateName}</p>
                        <p className="truncate text-xs text-text-muted">
                          {application.Job?.title}
                          {application.applied_at ? ` · Applied ${formatRelativeTime(application.applied_at)}` : ''}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <ApplicationStatusBadge status={application.status} />
                      </div>
                    </Link>
                  );
                })
              )}
            </CardBody>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} className="min-w-0">
          <Card>
            <div className="flex items-center justify-between gap-3 border-b border-border p-6 pb-4">
              <h2 className="text-base font-semibold text-text">Active Job Posts</h2>
              <Link
                to="/recruiter/jobs"
                className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
            <CardBody className="flex flex-col gap-3">
              {isJobsLoading ? (
                Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-[76px] w-full rounded-lg" />)
              ) : activeJobs.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <Briefcase className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-sm font-medium text-text">No active job postings.</p>
                  <p className="text-sm text-text-muted">Create your first job posting to start receiving applications.</p>
                  <Link to="/recruiter/jobs/new" className="mt-1">
                    <Button variant="outline" size="sm" leftIcon={Plus}>
                      Post a Job
                    </Button>
                  </Link>
                </div>
              ) : (
                activeJobs.map((job) => <ActiveJobRow key={job.jobId} job={job} />)
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      <motion.div {...fadeUp}>
        <Card>
          <div className="flex items-center justify-between gap-3 border-b border-border p-6 pb-4">
            <CardTitleWithIcon />
            <Link to="/recruiter/company" className="text-sm font-medium text-primary hover:text-primary-hover">
              Manage
            </Link>
          </div>
          <CardBody>
            {isDashboardLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : company ? (
              <div className="flex items-center gap-4">
                <CompanyLogo name={company.name} logoPath={company.logoPath} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">{company.name}</p>
                  <p className="truncate text-xs text-text-muted">{company.industry ?? 'Industry not set'}</p>
                  <Badge variant={dashboard.isVerified ? 'success' : 'warning'} className="mt-1">
                    {dashboard.isVerified ? 'Verified' : 'Pending verification'}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Building2 className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-sm font-medium text-text">No company profile yet</p>
                <p className="text-sm text-text-muted">Create your company profile to start posting jobs.</p>
                <Link to="/recruiter/company">
                  <Button variant="outline" size="sm" rightIcon={ArrowRight} className="mt-2">
                    Set up company
                  </Button>
                </Link>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

function CardTitleWithIcon() {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
      <h2 className="text-base font-semibold text-text">Company Profile</h2>
    </div>
  );
}
