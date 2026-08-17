import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Users,
  Inbox,
  Star,
  Trophy,
  FileText,
  ExternalLink,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableEmptyState, TableLoadingState } from '@/components/ui/Table';
import { Pagination } from '@/components/shared/Pagination';
import { ApplicationStatusBadge } from '@/features/student/components/ApplicationStatusBadge';
import { useMyApplications, useMyJobs, useRecruiterDashboard } from '@/features/recruiter/recruiterQueries';
import { env } from '@/utils/env';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'selected', label: 'Selected' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest' },
];

const PAGE_SIZE = 10;

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

function ResumeLink({ resume }) {
  if (!resume) {
    return <span className="text-sm text-text-muted">—</span>;
  }

  return (
    <a
      href={`${env.uploadBaseUrl}/${resume.filePath.replace(/^\/?/, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
    >
      <FileText className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      View Resume
    </a>
  );
}

function ApplicationCard({ application }) {
  const candidateName = application.StudentProfile?.User?.fullName ?? 'Unknown candidate';

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Avatar name={candidateName} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text">{candidateName}</p>
            <p className="truncate text-xs text-text-muted">{application.Job?.title}</p>
          </div>
          <ApplicationStatusBadge status={application.status} />
        </div>
        <p className="text-xs text-text-muted">Applied {new Date(application.applied_at).toLocaleDateString()}</p>
        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          <ResumeLink resume={application.Resume} />
          <Link to={`/recruiter/applications/${application.applicationId}`}>
            <Button variant="outline" size="sm">
              View Application
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

export function RecruiterApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const jobId = searchParams.get('jobId') ?? '';
  const sort = searchParams.get('sort') ?? 'recent';
  const page = Number(searchParams.get('page') ?? '1');

  const { data: dashboard, isLoading: isStatsLoading } = useRecruiterDashboard();
  const { data: jobs } = useMyJobs();
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useMyApplications({
    page,
    limit: PAGE_SIZE,
    status: status || undefined,
    jobId: jobId || undefined,
    search: search || undefined,
    sort,
  });

  const applications = data?.applications ?? [];
  const pagination = data?.pagination;
  const stats = dashboard?.applicationStats;
  const hasActiveFilters = Boolean(search || status || jobId);

  const jobOptions = [{ value: '', label: 'All Jobs' }, ...(jobs ?? []).map((job) => ({ value: String(job.jobId), label: job.title }))];

  function updateParams(updates) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (!('page' in updates)) {
      next.set('page', '1');
    }
    setSearchParams(next);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    updateParams({ search: searchInput });
  }

  function handleClearFilters() {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">Unable to load applications.</p>
        <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const isEmptyNoApplications = !isLoading && !hasActiveFilters && applications.length === 0;
  const isEmptyFiltered = !isLoading && hasActiveFilters && applications.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-semibold text-text">Applications</h1>
        <p className="mt-1 text-sm text-text-muted">Review and manage candidates who have applied to your jobs.</p>
      </motion.div>

      <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Inbox} label="Total Applications" value={stats?.totalApplications ?? 0} isLoading={isStatsLoading} />
        <StatTile icon={Users} label="Under Review" value={stats?.underReview ?? 0} isLoading={isStatsLoading} />
        <StatTile icon={Star} label="Shortlisted" value={stats?.shortlisted ?? 0} isLoading={isStatsLoading} />
        <StatTile icon={Trophy} label="Selected / Hired" value={stats?.selected ?? 0} isLoading={isStatsLoading} />
      </motion.div>

      <motion.div {...fadeUp} className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <Input
              className="pl-9"
              placeholder="Search candidates or jobs..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
        </form>
        <div className="w-full sm:w-56">
          <Select placeholder="All Jobs" value={jobId} onValueChange={(value) => updateParams({ jobId: value })} options={jobOptions} />
        </div>
        <div className="w-full sm:w-44">
          <Select
            placeholder="All Status"
            value={status}
            onValueChange={(value) => updateParams({ status: value })}
            options={STATUS_OPTIONS}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={sort} onValueChange={(value) => updateParams({ sort: value })} options={SORT_OPTIONS} />
        </div>
      </motion.div>

      {isEmptyNoApplications ? (
        <motion.div {...fadeUp}>
          <Card>
            <CardBody className="flex flex-col items-center gap-2 py-16 text-center">
              <Inbox className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-sm font-medium text-text">No applications yet.</p>
              <p className="text-sm text-text-muted">Applications from students will appear here when they apply to your jobs.</p>
              <Link to="/recruiter/jobs" className="mt-2">
                <Button variant="outline" size="sm">
                  View My Jobs
                </Button>
              </Link>
            </CardBody>
          </Card>
        </motion.div>
      ) : isEmptyFiltered ? (
        <motion.div {...fadeUp}>
          <Card>
            <CardBody className="flex flex-col items-center gap-2 py-16 text-center">
              <Search className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-sm font-medium text-text">
                {jobId ? 'No applications for this job yet.' : 'No candidates match your current filters.'}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" className="mt-2" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Desktop table */}
          <motion.div {...fadeUp} className="hidden md:block">
            <Table>
              <TableHeader>
                <TableHead>Candidate</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableLoadingState columns={6} rows={6} />
                ) : (
                  applications.map((application) => {
                    const candidateName = application.StudentProfile?.User?.fullName ?? 'Unknown candidate';
                    return (
                      <TableRow key={application.applicationId}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar name={candidateName} size="sm" />
                            <div className="min-w-0">
                              <Link
                                to={`/recruiter/applications/${application.applicationId}`}
                                className="truncate font-medium text-text hover:text-primary"
                              >
                                {candidateName}
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-text-muted">
                          <p className="text-text">{application.Job?.title}</p>
                          <p className="text-xs text-text-muted">{application.Job?.Company?.name}</p>
                        </TableCell>
                        <TableCell className="text-text-muted">
                          {new Date(application.applied_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <ApplicationStatusBadge status={application.status} />
                        </TableCell>
                        <TableCell>
                          <ResumeLink resume={application.Resume} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/recruiter/applications/${application.applicationId}`}>
                            <Button variant="outline" size="sm" rightIcon={ExternalLink}>
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            {!isLoading && applications.length === 0 && (
              <TableEmptyState icon={Inbox} title="No applications found" />
            )}
          </motion.div>

          {/* Mobile cards */}
          <motion.div {...fadeUp} className="flex flex-col gap-3 md:hidden">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-[132px] w-full rounded-lg" />)
              : applications.map((application) => <ApplicationCard key={application.applicationId} application={application} />)}
          </motion.div>
        </>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
        />
      )}
    </div>
  );
}
