import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, Star, XCircle, Trophy, Search, Inbox, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { ApplicationStatusBadge } from '@/features/student/components/ApplicationStatusBadge';
import { ApplicationDetailsModal } from '@/features/student/components/ApplicationDetailsModal';
import { useMyApplications } from '@/features/student/studentQueries';
import { cn } from '@/utils/cn';

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

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
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

function ApplicationCard({ application, onViewDetails }) {
  const job = application.Job;

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <CompanyLogo name={job?.Company?.name} logoPath={job?.Company?.logoPath} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-text">{job?.title}</p>
            <p className="truncate text-sm text-text-muted">{job?.Company?.name ?? 'Unknown company'}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
              {job?.location && <span>{job.location}</span>}
              {job?.location && job?.jobType && <span aria-hidden="true">•</span>}
              {job?.jobType && <span>{JOB_TYPE_LABEL[job.jobType] ?? job.jobType}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-text-muted">Applied {new Date(application.applied_at).toLocaleDateString()}</p>
            <ApplicationStatusBadge status={application.status} />
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/student/jobs/${application.jobId}`}>
              <Button variant="outline" size="sm">
                View Job
              </Button>
            </Link>
            <Button size="sm" onClick={() => onViewDetails(application.applicationId)}>
              View Details
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function StudentApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const { data, isLoading, isError, refetch } = useMyApplications({ page: 1, limit: 100 });
  const allApplications = data?.applications ?? [];

  const stats = {
    total: allApplications.length,
    pending: allApplications.filter((a) => a.status === 'applied' || a.status === 'under_review').length,
    shortlisted: allApplications.filter((a) => a.status === 'shortlisted').length,
    rejected: allApplications.filter((a) => a.status === 'rejected').length,
    selected: allApplications.filter((a) => a.status === 'selected').length,
  };

  let visibleApplications = allApplications;

  if (statusFilter !== 'all') {
    visibleApplications = visibleApplications.filter((application) => application.status === statusFilter);
  }

  if (search.trim()) {
    const query = search.trim().toLowerCase();
    visibleApplications = visibleApplications.filter(
      (application) =>
        application.Job?.title?.toLowerCase().includes(query) ||
        application.Job?.Company?.name?.toLowerCase().includes(query)
    );
  }

  visibleApplications = [...visibleApplications].sort((a, b) => {
    const aTime = new Date(a.applied_at).getTime();
    const bTime = new Date(b.applied_at).getTime();
    return sort === 'oldest' ? aTime - bTime : bTime - aTime;
  });

  if (isError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">Unable to load your applications.</p>
        <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-semibold text-text">My Applications</h1>
        <p className="mt-1 text-sm text-text-muted">
          Track the jobs you've applied to and monitor your application progress.
        </p>
      </motion.div>

      <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile icon={ClipboardList} label="Total Applications" value={stats.total} isLoading={isLoading} />
        <StatTile icon={Clock} label="Pending" value={stats.pending} isLoading={isLoading} />
        <StatTile icon={Star} label="Shortlisted" value={stats.shortlisted} isLoading={isLoading} />
        <StatTile icon={XCircle} label="Rejected" value={stats.rejected} isLoading={isLoading} />
        <StatTile icon={Trophy} label="Selected" value={stats.selected} isLoading={isLoading} />
      </motion.div>

      {!isLoading && allApplications.length === 0 ? (
        <motion.div {...fadeUp}>
          <Card>
            <CardBody className="flex flex-col items-center gap-3 py-16 text-center">
              <Inbox className="h-10 w-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-base font-semibold text-text">You haven't applied to any jobs yet.</p>
              <p className="text-sm text-text-muted">Explore opportunities and start your career journey.</p>
              <Link to="/student/jobs" className="mt-1">
                <Button>Find Jobs</Button>
              </Link>
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <>
          <motion.div {...fadeUp} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-100',
                    statusFilter === filter.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-muted text-text-muted hover:text-text'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <Input
                  placeholder="Search applications..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  value={sort}
                  onValueChange={setSort}
                  options={SORT_OPTIONS}
                  placeholder="Sort by"
                />
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="flex flex-col gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-[136px] w-full rounded-xl" />)
            ) : visibleApplications.length === 0 ? (
              <Card>
                <CardBody className="flex flex-col items-center gap-2 py-12 text-center">
                  <Inbox className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-sm font-medium text-text">No applications match your filters.</p>
                </CardBody>
              </Card>
            ) : (
              visibleApplications.map((application) => (
                <ApplicationCard
                  key={application.applicationId}
                  application={application}
                  onViewDetails={setSelectedApplicationId}
                />
              ))
            )}
          </motion.div>
        </>
      )}

      <ApplicationDetailsModal
        applicationId={selectedApplicationId}
        open={Boolean(selectedApplicationId)}
        onOpenChange={(open) => !open && setSelectedApplicationId(null)}
      />
    </div>
  );
}
