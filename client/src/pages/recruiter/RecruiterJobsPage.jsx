import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Briefcase,
  MoreVertical,
  Pencil,
  XCircle,
  Trash2,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/shared/DropdownMenu';
import { JobStatusBadge } from '@/features/recruiter/components/JobStatusBadge';
import { JobFormModal } from '@/features/recruiter/components/JobFormModal';
import { useToast } from '@/hooks/useToast';
import { useMyJobs, useCreateJob, useUpdateJob, useCloseJob, useDeleteJob } from '@/features/recruiter/recruiterQueries';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

const STATUS_OPTIONS = [
  { value: 'open', label: 'Active' },
  { value: 'closed', label: 'Closed' },
  { value: 'removed', label: 'Removed' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'applications', label: 'Most Applications' },
];

const JOB_TYPE_LABEL = {
  'full-time': 'Full Time',
  internship: 'Internship',
  'part-time': 'Part Time',
};

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

function JobRow({ job, onEdit, onClose, onDelete }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-border p-4 transition-colors duration-100 hover:border-border-strong sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/recruiter/jobs/${job.jobId}`} className="truncate text-sm font-semibold text-text hover:text-primary">
            {job.title}
          </Link>
          <JobStatusBadge status={job.status} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted">
            {JOB_TYPE_LABEL[job.jobType] ?? job.jobType}
          </span>
          {job.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted">
              <MapPin className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
              {job.location}
            </span>
          )}
          <span className="text-[11px] font-medium text-text-muted">
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </span>
          {job.deadline && (
            <span className="text-[11px] font-medium text-text-muted">
              · Deadline {new Date(job.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-3 sm:shrink-0 sm:justify-end">
        <div className="flex shrink-0 items-center gap-1.5 text-sm text-text-muted">
          <Users className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="font-medium text-text">{job.applicationCount}</span>
          {job.applicationCount === 1 ? 'application' : 'applications'}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link to={`/recruiter/jobs/${job.jobId}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
          <Link to={`/recruiter/jobs/${job.jobId}/applicants`}>
            <Button variant="outline" size="sm">
              Applications
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Job actions"
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text"
              >
                <MoreVertical className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => onEdit(job)}>
                <Pencil className="h-4 w-4" strokeWidth={1.75} />
                Edit
              </DropdownMenuItem>
              {job.status === 'open' && (
                <DropdownMenuItem destructive onSelect={() => onClose(job)}>
                  <XCircle className="h-4 w-4" strokeWidth={1.75} />
                  Close Job
                </DropdownMenuItem>
              )}
              {job.status !== 'removed' && (
                <DropdownMenuItem destructive onSelect={() => onDelete(job)}>
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  Delete Job
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export function RecruiterJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobToClose, setJobToClose] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const sort = searchParams.get('sort') ?? 'recent';
  const page = Number(searchParams.get('page') ?? '1');

  const { data: jobs, isLoading, isError, refetch } = useMyJobs();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const closeJob = useCloseJob();
  const deleteJob = useDeleteJob();
  const { showToast } = useToast();

  const stats = useMemo(() => {
    const all = jobs ?? [];
    return {
      total: all.length,
      active: all.filter((job) => job.status === 'open').length,
      closed: all.filter((job) => job.status === 'closed').length,
      removed: all.filter((job) => job.status === 'removed').length,
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const all = jobs ?? [];
    const filtered = all.filter((job) => {
      const matchesSearch = !search || job.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || job.status === status;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered];
    if (sort === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'applications') {
      sorted.sort((a, b) => b.applicationCount - a.applicationCount);
    } else {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;
  }, [jobs, search, status, sort]);

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE) || 1;
  const pagedJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasActiveFilters = Boolean(search || status);

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

  function handleOpenCreate() {
    setEditingJob(null);
    setFormOpen(true);
  }

  function handleOpenEdit(job) {
    setEditingJob(job);
    setFormOpen(true);
  }

  function handleFormSubmit(payload) {
    if (editingJob) {
      updateJob.mutate(
        { jobId: editingJob.jobId, payload },
        {
          onSuccess: () => {
            showToast({ variant: 'success', title: 'Job updated successfully.' });
            setFormOpen(false);
          },
          onError: (error) => {
            const message = error.response?.data?.message ?? 'Failed to update job.';
            showToast({ variant: 'danger', title: 'Update failed', description: message });
          },
        }
      );
    } else {
      createJob.mutate(payload, {
        onSuccess: () => {
          showToast({ variant: 'success', title: 'Job created successfully.' });
          setFormOpen(false);
        },
        onError: (error) => {
          const message = error.response?.data?.message ?? 'Failed to create job.';
          showToast({ variant: 'danger', title: 'Creation failed', description: message });
        },
      });
    }
  }

  function handleConfirmClose() {
    if (!jobToClose) return;
    closeJob.mutate(jobToClose.jobId, {
      onSuccess: () => {
        showToast({ variant: 'success', title: 'Job closed.' });
        setJobToClose(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to close job.';
        showToast({ variant: 'danger', title: 'Close failed', description: message });
        setJobToClose(null);
      },
    });
  }

  function handleConfirmDelete() {
    if (!jobToDelete || deleteJob.isPending) return;
    deleteJob.mutate(jobToDelete.jobId, {
      onSuccess: (result) => {
        const wasSoftDeleted = result?.status === 'removed';
        showToast({
          variant: 'success',
          title: wasSoftDeleted ? 'Job removed.' : 'Job deleted.',
          description: wasSoftDeleted
            ? 'This job had existing applications, so it was marked as removed instead of being permanently deleted.'
            : undefined,
        });
        setJobToDelete(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to delete job.';
        showToast({ variant: 'danger', title: 'Delete failed', description: message });
        setJobToDelete(null);
      },
    });
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">Unable to load your jobs.</p>
        <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div {...fadeUp} className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-text">My Jobs</h1>
          <p className="mt-1 text-sm text-text-muted">Manage your job postings and track applications.</p>
        </div>
        <Button leftIcon={Plus} onClick={handleOpenCreate}>
          Post a Job
        </Button>
      </motion.div>

      <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Briefcase} label="Total Jobs" value={stats.total} isLoading={isLoading} />
        <StatTile icon={CheckCircle2} label="Active Jobs" value={stats.active} isLoading={isLoading} />
        <StatTile icon={XCircle} label="Closed" value={stats.closed} isLoading={isLoading} />
        <StatTile icon={Trash2} label="Removed" value={stats.removed} isLoading={isLoading} />
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
              placeholder="Search jobs by title..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
        </form>
        <div className="w-full sm:w-44">
          <Select
            placeholder="All statuses"
            value={status}
            onValueChange={(value) => updateParams({ status: value })}
            options={STATUS_OPTIONS}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={sort} onValueChange={(value) => updateParams({ sort: value })} options={SORT_OPTIONS} />
        </div>
      </motion.div>

      <motion.div {...fadeUp}>
        <Card>
          <CardBody className="flex flex-col gap-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-[92px] w-full rounded-lg" />)
            ) : pagedJobs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <Briefcase className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                {jobs?.length === 0 ? (
                  <>
                    <p className="text-sm font-medium text-text">No job postings yet.</p>
                    <p className="text-sm text-text-muted">Create your first job posting to start receiving applications.</p>
                    <Button leftIcon={Plus} size="sm" className="mt-2" onClick={handleOpenCreate}>
                      Post a Job
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-text">No jobs match your search.</p>
                    {hasActiveFilters && (
                      <Button variant="outline" size="sm" className="mt-2" onClick={handleClearFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </>
                )}
              </div>
            ) : (
              pagedJobs.map((job) => (
                <JobRow key={job.jobId} job={job} onEdit={handleOpenEdit} onClose={setJobToClose} onDelete={setJobToDelete} />
              ))
            )}
          </CardBody>
        </Card>
      </motion.div>

      {filteredJobs.length > 0 && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filteredJobs.length}
          limit={PAGE_SIZE}
          onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
        />
      )}

      <JobFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        job={editingJob}
        onSubmit={handleFormSubmit}
        isSubmitting={createJob.isPending || updateJob.isPending}
      />

      <ConfirmDialog
        open={Boolean(jobToClose)}
        onOpenChange={(open) => !open && setJobToClose(null)}
        title="Close this job?"
        description="Students will no longer be able to submit new applications."
        confirmLabel="Close Job"
        variant="destructive"
        isLoading={closeJob.isPending}
        onConfirm={handleConfirmClose}
      />

      <ConfirmDialog
        open={Boolean(jobToDelete)}
        onOpenChange={(open) => !open && !deleteJob.isPending && setJobToDelete(null)}
        title="Delete this job?"
        description="This job will no longer be visible to students and cannot be restored to an open state. If it already has applications, it will be marked as removed instead of permanently deleted, so existing applicants keep their history."
        confirmLabel="Delete Job"
        variant="destructive"
        isLoading={deleteJob.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
