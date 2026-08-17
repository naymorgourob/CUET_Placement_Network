import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Heart, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { JobCard } from '@/features/student/components/JobCard';
import { useToast } from '@/hooks/useToast';
import {
  useMySavedJobs,
  useMyApplications,
  useSaveJob,
  useUnsaveJob,
} from '@/features/student/studentQueries';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

const JOB_TYPE_OPTIONS = [
  { value: 'all', label: 'All Job Types' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'part-time', label: 'Part-time' },
];

const SORT_OPTIONS = [
  { value: 'saved', label: 'Recently Saved' },
  { value: 'posted', label: 'Recently Posted' },
];

export function StudentSavedJobsPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('all');
  const [sort, setSort] = useState('saved');

  const { data: savedJobs, isLoading, isError, refetch } = useMySavedJobs();
  const { data: applicationsData } = useMyApplications({ page: 1, limit: 100 });
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const entries = savedJobs ?? [];
  const appliedJobIds = new Set((applicationsData?.applications ?? []).map((application) => application.jobId));

  let visibleEntries = entries;

  if (jobType !== 'all') {
    visibleEntries = visibleEntries.filter((entry) => entry.job?.jobType === jobType);
  }

  if (search.trim()) {
    const query = search.trim().toLowerCase();
    visibleEntries = visibleEntries.filter(
      (entry) =>
        entry.job?.title?.toLowerCase().includes(query) || entry.job?.Company?.name?.toLowerCase().includes(query)
    );
  }

  visibleEntries = [...visibleEntries].sort((a, b) => {
    if (sort === 'posted') {
      return new Date(b.job?.createdAt ?? 0).getTime() - new Date(a.job?.createdAt ?? 0).getTime();
    }
    return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
  });

  function handleUnsave(jobId) {
    unsaveJob.mutate(jobId, {
      onSuccess: () => showToast({ variant: 'success', title: 'Job removed from saved jobs.' }),
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to remove job.';
        showToast({ variant: 'danger', title: 'Something went wrong', description: message });
      },
    });
  }

  function handleToggleSave(jobId, isSaved) {
    if (isSaved) {
      handleUnsave(jobId);
    } else {
      saveJob.mutate(jobId);
    }
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">Unable to load your saved jobs.</p>
        <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-semibold text-text">Saved Jobs</h1>
        <p className="mt-1 text-sm text-text-muted">Jobs you've saved for later.</p>
      </motion.div>

      <motion.div {...fadeUp}>
        <Card className="w-fit">
          <CardBody className="flex items-center gap-3.5 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted">Saved Jobs</p>
              {isLoading ? (
                <Skeleton className="mt-1.5 h-6 w-10" />
              ) : (
                <p className="mt-0.5 text-2xl font-semibold tracking-tight text-text">{entries.length}</p>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {!isLoading && entries.length === 0 ? (
        <motion.div {...fadeUp}>
          <Card>
            <CardBody className="flex flex-col items-center gap-3 py-16 text-center">
              <Heart className="h-10 w-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-base font-semibold text-text">You haven't saved any jobs yet.</p>
              <p className="max-w-sm text-sm text-text-muted">
                Save interesting opportunities from Find Jobs and come back to them later.
              </p>
              <Link to="/student/jobs" className="mt-1">
                <Button>Find Jobs</Button>
              </Link>
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <>
          <motion.div {...fadeUp} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <Input
                placeholder="Search saved jobs..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-44">
              <Select value={jobType} onValueChange={setJobType} options={JOB_TYPE_OPTIONS} placeholder="Job Type" />
            </div>
            <div className="w-full sm:w-48">
              <Select value={sort} onValueChange={setSort} options={SORT_OPTIONS} placeholder="Sort by" />
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-xl border border-border bg-surface p-6">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-1.5">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                </div>
              ))
            ) : visibleEntries.length === 0 ? (
              <div className="col-span-full flex flex-col items-center gap-2 rounded-xl border border-border bg-surface py-16 text-center">
                <Search className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-sm font-medium text-text">No saved jobs match your filters.</p>
              </div>
            ) : (
              visibleEntries.map((entry) => (
                <JobCard
                  key={entry.savedJobId}
                  job={entry.job}
                  hasApplied={appliedJobIds.has(entry.job.jobId)}
                  isSaved
                  onToggleSave={handleToggleSave}
                  isSaveLoading={saveJob.isPending || unsaveJob.isPending}
                  savedAt={entry.savedAt}
                />
              ))
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
