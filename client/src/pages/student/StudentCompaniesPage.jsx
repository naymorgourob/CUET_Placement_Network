import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Building2, X, SlidersHorizontal, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/shared/Pagination';
import { StudentCompanyCard } from '@/features/student/components/StudentCompanyCard';
import { usePublicCompanies } from '@/features/public/publicCompaniesQueries';
import { cn } from '@/utils/cn';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

const PAGE_SIZE = 12;

function FilterFields({ industry, industryOptions, onChange }) {
  return (
    <Select
      label="Industry"
      placeholder="All industries"
      value={industry ?? ''}
      onValueChange={(value) => onChange({ industry: value })}
      options={industryOptions}
    />
  );
}

export function StudentCompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const page = Number(searchParams.get('page') ?? '1');
  const search = searchParams.get('search') ?? undefined;
  const industry = searchParams.get('industry') ?? undefined;

  const { data, isLoading, isFetching, isError, refetch } = usePublicCompanies({
    page,
    limit: PAGE_SIZE,
    search,
    industry,
  });
  const { data: allCompaniesData } = usePublicCompanies({ limit: 100 });

  const companies = data?.companies ?? [];
  const pagination = data?.pagination;
  const hasActiveFilters = Boolean(search || industry);

  const industryOptions = useMemo(() => {
    const industries = new Set(
      (allCompaniesData?.companies ?? []).map((company) => company.industry).filter(Boolean)
    );
    return Array.from(industries)
      .sort()
      .map((value) => ({ value, label: value }));
  }, [allCompaniesData]);

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
    setIsFilterDrawerOpen(false);
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">Unable to load companies.</p>
        <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-semibold text-text">Companies</h1>
        <p className="mt-1 text-sm text-text-muted">Discover companies hiring through the CUET Placement Network.</p>
      </motion.div>

      <motion.div {...fadeUp} className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-3">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <Input
              className="pl-9"
              placeholder="Search companies..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <Button type="submit" className="shrink-0">
            Search
          </Button>
        </form>
        <div className="hidden sm:block sm:w-56">
          <Select
            placeholder="Industry"
            value={industry ?? ''}
            onValueChange={(value) => updateParams({ industry: value })}
            options={industryOptions}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          leftIcon={SlidersHorizontal}
          className="shrink-0 sm:hidden"
          onClick={() => setIsFilterDrawerOpen(true)}
        >
          Filters
          {industry && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              1
            </span>
          )}
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface py-16 text-center">
          <Building2 className="h-10 w-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
          {hasActiveFilters ? (
            <>
              <p className="text-sm font-semibold text-text">No companies found.</p>
              <p className="max-w-sm text-sm text-text-muted">
                Try a different company name, industry, or location.
              </p>
              <Button variant="outline" size="sm" className="mt-1" onClick={handleClearFilters}>
                Clear Search
              </Button>
            </>
          ) : (
            <p className="text-sm font-semibold text-text">No companies available yet.</p>
          )}
        </div>
      ) : (
        <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3', isFetching && 'opacity-60')}>
          {companies.map((company) => (
            <StudentCompanyCard key={company.companyId} company={company} />
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
        <FilterFields industry={industry} industryOptions={industryOptions} onChange={updateParams} />
      </Modal>
    </div>
  );
}
