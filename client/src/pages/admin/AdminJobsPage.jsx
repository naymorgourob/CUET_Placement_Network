import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableEmptyState,
  TableLoadingState,
} from '@/components/ui/Table';
import { Pagination } from '@/components/shared/Pagination';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { JobStatusBadge } from '@/features/recruiter/components/JobStatusBadge';
import { useToast } from '@/hooks/useToast';
import { useAdminJobs, useRemoveJob } from '@/features/admin/adminQueries';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'removed', label: 'Removed' },
];

export function AdminJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [jobToRemove, setJobToRemove] = useState(null);

  const search = searchParams.get('search') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');

  const { data, isLoading, isFetching } = useAdminJobs({ page, limit: 10, search, status });
  const removeJob = useRemoveJob();
  const { showToast } = useToast();

  const jobs = data?.jobs ?? [];
  const pagination = data?.pagination;

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

  function handleConfirmRemove() {
    if (!jobToRemove) return;
    removeJob.mutate(jobToRemove.jobId, {
      onSuccess: () => {
        showToast({ variant: 'success', title: 'Job removed.' });
        setJobToRemove(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to remove job.';
        showToast({ variant: 'danger', title: 'Remove failed', description: message });
        setJobToRemove(null);
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <h1 className="text-xl font-semibold text-text">Job Moderation</h1>
        <p className="mt-1 text-sm text-text-muted">Review and moderate job postings across the platform.</p>
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row">
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
        <div className="w-full sm:w-48">
          <Select
            placeholder="All statuses"
            value={status ?? ''}
            onValueChange={(value) => updateParams({ status: value })}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableHead>Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Posted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoadingState columns={5} rows={5} />
          ) : jobs.length === 0 ? (
            <TableEmptyState colSpan={5} icon={Briefcase} title="No jobs found" description="Try adjusting your search or filters." />
          ) : (
            jobs.map((job) => (
              <TableRow key={job.jobId} className={isFetching ? 'opacity-60' : ''}>
                <TableCell>
                  <Link to={`/jobs/${job.jobId}`} className="font-medium text-text hover:text-primary">
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell className="text-text-muted">{job.Company?.name}</TableCell>
                <TableCell>
                  <JobStatusBadge status={job.status} />
                </TableCell>
                <TableCell className="text-text-muted">{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {job.status !== 'removed' && (
                    <Button size="sm" variant="outline" leftIcon={Trash2} onClick={() => setJobToRemove(job)}>
                      Remove
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
        />
      )}

      <ConfirmDialog
        open={Boolean(jobToRemove)}
        onOpenChange={(open) => !open && setJobToRemove(null)}
        title="Remove this job?"
        description="This job will be logically removed and hidden from public listings. It will not be permanently deleted."
        confirmLabel="Remove Job"
        variant="destructive"
        isLoading={removeJob.isPending}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
