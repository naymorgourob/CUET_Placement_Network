import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { StudentResourceCard } from '@/features/student/components/StudentResourceCard';
import { Pagination } from '@/components/shared/Pagination';
import { usePublicResources } from '@/features/public/publicResourcesQueries';
import { RESOURCE_CATEGORIES } from '@/utils/resourceCategories';
import { cn } from '@/utils/cn';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

const PAGE_SIZE = 9;

export function StudentResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const page = Number(searchParams.get('page') ?? '1');
  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;

  const { data, isLoading, isFetching, isError, refetch } = usePublicResources({
    page,
    limit: PAGE_SIZE,
    search,
    category,
  });

  const resources = data?.resources ?? [];
  const pagination = data?.pagination;
  const hasActiveFilters = Boolean(search || category);

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
        <p className="text-sm font-semibold text-text">Unable to load resources.</p>
        <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-semibold text-text">Career Resources</h1>
        <p className="mt-1 text-sm text-text-muted">
          Practical guides, career advice, interview tips, and resources to help you prepare for your next
          opportunity.
        </p>
      </motion.div>

      <motion.div {...fadeUp}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Search resources..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </form>
      </motion.div>

      <motion.div {...fadeUp} className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => updateParams({ category: undefined })}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-100',
            !category ? 'bg-primary text-white' : 'bg-surface-muted text-text-muted hover:text-text'
          )}
        >
          All
        </button>
        {RESOURCE_CATEGORIES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => updateParams({ category: option.value })}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-100',
              category === option.value
                ? 'bg-primary text-white'
                : 'bg-surface-muted text-text-muted hover:text-text'
            )}
          >
            {option.label}
          </button>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface py-16 text-center">
          <BookOpen className="h-10 w-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
          {hasActiveFilters ? (
            <>
              <p className="text-sm font-semibold text-text">No resources found.</p>
              <p className="max-w-sm text-sm text-text-muted">Try a different search term or category.</p>
              <Button variant="outline" size="sm" className="mt-1" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-text">No resources are available yet.</p>
              <p className="max-w-sm text-sm text-text-muted">
                Check back soon for new career guides and articles.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', isFetching && 'opacity-60')}>
          {resources.map((resource) => (
            <StudentResourceCard key={resource.resourceId} resource={resource} />
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
  );
}
