import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  Building2,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  ShieldAlert,
  UserCog,
  Inbox,
  FileBarChart,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { VerificationStatusBadge } from '@/features/admin/components/VerificationStatusBadge';
import { JobStatusBadge } from '@/features/recruiter/components/JobStatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useAdminDashboard, useAdminRecruiters, useAdminJobs } from '@/features/admin/adminQueries';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

function StatCard({ icon: Icon, label, value, isLoading }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
          {isLoading ? <Skeleton className="mt-1 h-6 w-12" /> : <p className="text-xl font-semibold text-text">{value}</p>}
        </div>
      </CardBody>
    </Card>
  );
}

const QUICK_ACTIONS = [
  { to: '/admin/recruiters', label: 'Verify Recruiters', icon: ShieldAlert },
  { to: '/admin/users', label: 'Manage Users', icon: UserCog },
  { to: '/admin/jobs', label: 'Moderate Jobs', icon: Briefcase },
  { to: '/admin/reports', label: 'View Reports', icon: FileBarChart },
];

export function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: dashboard, isLoading: isDashboardLoading } = useAdminDashboard();
  const { data: recruiters, isLoading: isRecruitersLoading } = useAdminRecruiters();
  const { data: jobsData, isLoading: isJobsLoading } = useAdminJobs({ page: 1, limit: 5 });

  const recentRecruiters = (recruiters ?? []).slice(0, 5);
  const recentJobs = (jobsData?.jobs ?? []).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-semibold text-text">Welcome back, {user?.fullName?.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-text-muted">Here's an overview of the platform.</p>
      </motion.div>

      <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={dashboard?.totalStudents ?? 0} isLoading={isDashboardLoading} />
        <StatCard icon={UserCog} label="Total Recruiters" value={dashboard?.totalRecruiters ?? 0} isLoading={isDashboardLoading} />
        <StatCard icon={Building2} label="Total Companies" value={dashboard?.totalCompanies ?? 0} isLoading={isDashboardLoading} />
        <StatCard icon={Briefcase} label="Total Jobs" value={dashboard?.totalJobs ?? 0} isLoading={isDashboardLoading} />
        <StatCard icon={CheckCircle2} label="Open Jobs" value={dashboard?.openJobs ?? 0} isLoading={isDashboardLoading} />
        <StatCard icon={XCircle} label="Closed Jobs" value={dashboard?.closedJobs ?? 0} isLoading={isDashboardLoading} />
        <StatCard
          icon={ClipboardCheck}
          label="Total Applications"
          value={dashboard?.totalApplications ?? 0}
          isLoading={isDashboardLoading}
        />
        <StatCard
          icon={ShieldAlert}
          label="Pending Verifications"
          value={dashboard?.pendingRecruiterVerifications ?? 0}
          isLoading={isDashboardLoading}
        />
      </motion.div>

      <motion.div {...fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-surface-muted"
              >
                <action.icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-sm font-medium text-text">{action.label}</span>
              </Link>
            ))}
          </CardBody>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div {...fadeUp}>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Recruiters</CardTitle>
              <Link to="/admin/recruiters" className="text-sm font-medium text-primary hover:text-primary-hover">
                View all
              </Link>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              {isRecruitersLoading ? (
                Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)
              ) : recentRecruiters.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Inbox className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-sm font-medium text-text">No recruiters yet</p>
                  <p className="text-sm text-text-muted">Recruiters who register will appear here.</p>
                </div>
              ) : (
                recentRecruiters.map((recruiter) => (
                  <div
                    key={recruiter.recruiterProfileId}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">{recruiter.User?.fullName}</p>
                      <p className="truncate text-xs text-text-muted">{recruiter.Company?.name ?? 'No company yet'}</p>
                    </div>
                    <VerificationStatusBadge isVerified={recruiter.isVerified} />
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </motion.div>

        <motion.div {...fadeUp}>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Jobs</CardTitle>
              <Link to="/admin/jobs" className="text-sm font-medium text-primary hover:text-primary-hover">
                View all
              </Link>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              {isJobsLoading ? (
                Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)
              ) : recentJobs.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Inbox className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-sm font-medium text-text">No jobs posted yet</p>
                  <p className="text-sm text-text-muted">Jobs posted by recruiters will appear here.</p>
                </div>
              ) : (
                recentJobs.map((job) => (
                  <div key={job.jobId} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">{job.title}</p>
                      <p className="truncate text-xs text-text-muted">{job.Company?.name}</p>
                    </div>
                    <JobStatusBadge status={job.status} />
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
