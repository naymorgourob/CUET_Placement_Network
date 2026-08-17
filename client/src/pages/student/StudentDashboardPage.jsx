import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  ClipboardList,
  Star,
  Trophy,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Sparkles,
  Inbox,
  Bell,
  FileText,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { ApplicationStatusBadge } from '@/features/student/components/ApplicationStatusBadge';
import { formatRelativeTime } from '@/utils/formatRelativeTime';
import { useAuth } from '@/hooks/useAuth';
import { useStudentDashboard, useMyApplications, useJobs } from '@/features/student/studentQueries';
import { useNotifications } from '@/features/notifications/notificationQueries';

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

function StatTile({ icon: Icon, label, value, isLoading, to }) {
  const content = (
    <Card className={to ? 'transition-shadow duration-150 hover:shadow-hover' : undefined}>
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

  return to ? (
    <Link to={to} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

function RecommendedJobRow({ job }) {
  return (
    <Link
      to={`/student/jobs/${job.jobId}`}
      className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-colors duration-100 hover:border-border-strong hover:bg-surface-muted"
    >
      <CompanyLogo name={job.Company?.name} logoPath={job.Company?.logoPath} size="lg" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text group-hover:text-primary">{job.title}</p>
        <p className="mt-0.5 truncate text-xs text-text-muted">{job.Company?.name ?? 'Unknown company'}</p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {job.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted">
              <MapPin className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
              {job.location}
            </span>
          )}
          <Badge variant="default" icon={null} className="text-[11px]">
            {JOB_TYPE_LABEL[job.jobType] ?? job.jobType}
          </Badge>
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

export function StudentDashboardPage() {
  const { user } = useAuth();
  const { data: dashboard, isLoading: isDashboardLoading } = useStudentDashboard();
  const { data: applicationsData, isLoading: isApplicationsLoading } = useMyApplications({ page: 1, limit: 100 });
  const { data: recentApplicationsData, isLoading: isRecentLoading } = useMyApplications({ page: 1, limit: 4 });
  const { data: jobsData, isLoading: isJobsLoading } = useJobs({ page: 1, limit: 5 });
  const { data: notificationsData, isLoading: isNotificationsLoading } = useNotifications({ page: 1, limit: 3 });

  const allApplications = applicationsData?.applications ?? [];
  const recentApplications = recentApplicationsData?.applications ?? [];
  const recommendedJobs = jobsData?.jobs ?? [];
  const notifications = notificationsData?.notifications ?? [];
  const appliedJobIds = new Set(allApplications.map((application) => application.jobId));

  const stats = {
    applications: allApplications.length,
    underReview: allApplications.filter((a) => a.status === 'under_review').length,
    shortlisted: allApplications.filter((a) => a.status === 'shortlisted').length,
    selected: allApplications.filter((a) => a.status === 'selected').length,
  };

  const firstName = user?.fullName?.split(' ')[0] ?? 'there';
  const greeting = greetingForHour(new Date().getHours());
  const profileCompletion = dashboard?.profileCompletionPercentage ?? 0;
  const latestActivity = notifications[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome header */}
      <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-text-muted">Find your next opportunity and take the next step in your career.</p>
        </div>
        <Link to="/student/jobs" className="shrink-0">
          <Button leftIcon={Briefcase}>Browse Jobs</Button>
        </Link>
      </motion.div>

      {/* Quick statistics */}
      <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={ClipboardList}
          label="Applications"
          value={stats.applications}
          isLoading={isApplicationsLoading}
          to="/student/applications"
        />
        <StatTile
          icon={Inbox}
          label="Under Review"
          value={stats.underReview}
          isLoading={isApplicationsLoading}
          to="/student/applications"
        />
        <StatTile
          icon={Star}
          label="Shortlisted"
          value={stats.shortlisted}
          isLoading={isApplicationsLoading}
          to="/student/applications"
        />
        <StatTile
          icon={Trophy}
          label="Selected"
          value={stats.selected}
          isLoading={isApplicationsLoading}
          to="/student/applications"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <motion.div {...fadeUp}>
            <Card>
              <div className="flex items-center justify-between gap-3 border-b border-border p-6 pb-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-text">Recommended for You</h2>
                  <p className="mt-0.5 truncate text-sm text-text-muted">Opportunities that may match your profile.</p>
                </div>
                <Link
                  to="/student/jobs"
                  className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
                >
                  Browse all
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </div>
              <CardBody className="flex flex-col gap-3">
                {isJobsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-[76px] w-full rounded-lg" />)
                ) : recommendedJobs.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <Briefcase className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                    <p className="text-sm font-medium text-text">No opportunities to recommend yet.</p>
                    <Link to="/student/jobs" className="mt-1">
                      <Button variant="outline" size="sm">
                        Explore Jobs
                      </Button>
                    </Link>
                  </div>
                ) : (
                  recommendedJobs.map((job) => (
                    <div key={job.jobId} className="relative">
                      <RecommendedJobRow job={job} />
                      {appliedJobIds.has(job.jobId) && (
                        <span className="absolute right-4 top-4 text-[11px] font-medium text-success">Already applied</span>
                      )}
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </motion.div>

          <motion.div {...fadeUp}>
            <Card>
              <div className="flex items-center justify-between gap-3 border-b border-border p-6 pb-4">
                <h2 className="min-w-0 truncate text-base font-semibold text-text">Recent Applications</h2>
                <Link
                  to="/student/applications"
                  className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
                >
                  View All Applications
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </div>
              <CardBody className="flex flex-col gap-3">
                {isRecentLoading ? (
                  Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-16 w-full rounded-lg" />)
                ) : recentApplications.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <FileText className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                    <p className="text-sm font-medium text-text">No applications yet</p>
                    <p className="text-sm text-text-muted">Jobs you apply to will appear here.</p>
                  </div>
                ) : (
                  recentApplications.map((application) => (
                    <div
                      key={application.applicationId}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <CompanyLogo name={application.Job?.Company?.name} logoPath={application.Job?.Company?.logoPath} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text">{application.Job?.title}</p>
                        <p className="truncate text-xs text-text-muted">
                          {application.Job?.Company?.name}
                          {application.createdAt ? ` · Applied ${new Date(application.createdAt).toLocaleDateString()}` : ''}
                        </p>
                      </div>
                      <ApplicationStatusBadge status={application.status} />
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Right rail */}
        <div className="flex min-w-0 flex-col gap-6">
          <motion.div {...fadeUp}>
            <Card>
              <div className="border-b border-border p-6 pb-4">
                <h2 className="text-base font-semibold text-text">Recent Activity</h2>
              </div>
              <CardBody>
                {isNotificationsLoading ? (
                  <Skeleton className="h-16 w-full rounded-lg" />
                ) : !latestActivity ? (
                  <div className="flex flex-col items-center gap-2 py-6 text-center">
                    <Bell className="h-7 w-7 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                    <p className="text-sm font-medium text-text">Nothing new right now</p>
                    <p className="text-xs text-text-muted">Keep exploring opportunities.</p>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bell className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text">{latestActivity.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">{latestActivity.message}</p>
                      <p className="mt-1 text-[11px] text-text-muted">{formatRelativeTime(latestActivity.createdAt)}</p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          <motion.div {...fadeUp}>
            <Card>
              <CardBody>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  <h2 className="text-sm font-semibold text-text">AI Career Tools</h2>
                </div>
                <p className="mt-1.5 text-sm text-text-muted">Analyze your resume, improve it, and check job matches.</p>
                <Link to="/student/resumes" className="mt-3 inline-block">
                  <Button variant="outline" size="sm" rightIcon={ArrowRight}>
                    Explore AI Tools
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div {...fadeUp}>
            <Card>
              <CardBody>
                <h2 className="text-sm font-semibold text-text">Complete your profile</h2>
                {isDashboardLoading ? (
                  <Skeleton className="mt-3 h-6 w-16" />
                ) : (
                  <p className="mt-1 text-2xl font-semibold text-text">{profileCompletion}%</p>
                )}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-text-muted">
                  Add your skills and experience to improve your career opportunities.
                </p>
                <Link to="/student/profile" className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
                  Complete Profile
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
