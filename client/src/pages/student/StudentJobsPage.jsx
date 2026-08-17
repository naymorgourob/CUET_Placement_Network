import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, SlidersHorizontal, AlertTriangle, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/shared/Pagination';
import { JobCard } from '@/features/student/components/JobCard';
import {
  useJobs,
  useMyApplications,
  useSavedJobIds,
  useSaveJob,
  useUnsaveJob,
} from '@/features/student/studentQueries';

const JOB_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'part-time', label: 'Part-time' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest First' },
];

const PAGE_SIZE = 9;

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1], delay },
  };
}

function FilterFields({ jobType, location, company, sort, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Job Type"
        placeholder="All job types"
        value={jobType ?? ''}
        onValueChange={(value) => onChange({ jobType: value })}
        options={JOB_TYPE_OPTIONS}
      />
      <Input
        label="Location"
        placeholder="e.g. Dhaka"
        value={location}
        onChange={(event) => onChange({ location: event.target.value })}
      />
      <Input
        label="Company"
        placeholder="e.g. Google"
        value={company}
        onChange={(event) => onChange({ company: event.target.value })}
      />
      <Select
        label="Sort By"
        value={sort}
        onValueChange={(value) => onChange({ sort: value })}
        options={SORT_OPTIONS}
      />
    </div>
  );
}

export function StudentJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [locationInput, setLocationInput] = useState(searchParams.get('location') ?? '');
  const [companyInput, setCompanyInput] = useState(searchParams.get('company') ?? '');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const page = Number(searchParams.get('page') ?? '1');
  const search = searchParams.get('search') ?? undefined;
  const location = searchParams.get('location') ?? undefined;
  const jobType = searchParams.get('jobType') ?? undefined;
  const company = searchParams.get('company') ?? undefined;
  const sort = searchParams.get('sort') ?? 'newest';

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useJobs({ page, limit: PAGE_SIZE, search, location, jobType, company, sort });
  const { data: applicationsData } = useMyApplications({ page: 1, limit: 100 });
  const { data: savedJobIds } = useSavedJobIds();
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const jobs = data?.jobs ?? [];
  const pagination = data?.pagination;
  const appliedJobIds = new Set((applicationsData?.applications ?? []).map((application) => application.jobId));
  const savedIdSet = new Set(savedJobIds ?? []);

  const activeFilterCount = [jobType, location, company].filter(Boolean).length;
  const hasActiveFilters = Boolean(search || jobType || location || company);

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
    updateParams({ search: searchInput, location: locationInput, company: companyInput });
  }

  function handleFilterFieldChange(updates) {
    if ('location' in updates) setLocationInput(updates.location);
    if ('company' in updates) setCompanyInput(updates.company);
    updateParams(updates);
  }

  function handleClearFilters() {
    setSearchInput('');
    setLocationInput('');
    setCompanyInput('');
    setSearchParams(new URLSearchParams());
    setIsFilterDrawerOpen(false);
  }

  function handleToggleSave(jobId, isSaved) {
    if (isSaved) {
      unsaveJob.mutate(jobId);
    } else {
      saveJob.mutate(jobId);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div {...fadeUp()}>
        <h1 className="text-xl font-semibold text-text">Find Your Next Opportunity</h1>
        <p className="mt-1 text-sm text-text-muted">
          Discover jobs and internships that match your interests and career goals.
        </p>
      </motion.div>

      <motion.div {...fadeUp(0.05)} className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <Input
              className="pl-9"
              placeholder="Search jobs, skills or companies..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <Input
              placeholder="Location"
              value={locationInput}
              onChange={(event) => setLocationInput(event.target.value)}
            />
          </div>
          <Button type="submit" className="shrink-0">
            Search
          </Button>
        </form>
        <Button
          type="button"
          variant="outline"
          leftIcon={SlidersHorizontal}
          className="shrink-0 lg:hidden"
          onClick={() => setIsFilterDrawerOpen(true)}
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-4">
        <motion.aside {...fadeUp(0.1)} className="hidden lg:col-span-1 lg:block">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">Filters</h2>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-medium text-primary hover:text-primary-hover"
                >
                  Clear all
                </button>
              )}
            </div>
            <FilterFields
              jobType={jobType}
              location={locationInput}
              company={companyInput}
              sort={sort}
              onChange={handleFilterFieldChange}
            />
          </div>
        </motion.aside>

        <div className="flex flex-col gap-4 lg:col-span-3">
          <motion.div {...fadeUp(0.1)} className="flex items-center justify-between">
            <div className="text-sm text-text-muted">
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <>
                  <span className="font-semibold text-text">{pagination?.total ?? 0}</span> jobs found
                </>
              )}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-xl border border-border bg-surface p-6">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="mt-4 flex gap-1.5">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface py-16 text-center">
              <AlertTriangle className="h-10 w-10 text-danger" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-sm font-semibold text-text">Unable to load jobs.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface py-16 text-center">
              <Briefcase className="h-10 w-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-sm font-semibold text-text">No jobs found.</p>
              <p className="max-w-sm text-sm text-text-muted">Try changing your search or filters.</p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" className="mt-2" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${isFetching ? 'opacity-60' : ''}`}>
              {jobs.map((job) => (
                <JobCard
                  key={job.jobId}
                  job={job}
                  hasApplied={appliedJobIds.has(job.jobId)}
                  isSaved={savedIdSet.has(job.jobId)}
                  onToggleSave={handleToggleSave}
                  isSaveLoading={saveJob.isPending || unsaveJob.isPending}
                />
              ))}
            </div>
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
      </div>

      <Modal
        open={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
        title="Filters"
        size="sm"
        footer={
          <>
            {hasActiveFilters && (
              <Button variant="ghost" leftIcon={X} onClick={handleClearFilters}>
                Clear all
              </Button>
            )}
            <Button onClick={() => setIsFilterDrawerOpen(false)}>Apply</Button>
          </>
        }
      >
        <FilterFields
          jobType={jobType}
          location={locationInput}
          company={companyInput}
          sort={sort}
          onChange={handleFilterFieldChange}
        />
      </Modal>
    </div>
  );
}
