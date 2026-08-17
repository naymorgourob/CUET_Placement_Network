import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { PublicCompanyCard } from '@/components/shared/PublicCompanyCard';
import { usePublicCompanies } from '@/features/public/publicCompaniesQueries';
import { cn } from '@/utils/cn';

export function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const page = Number(searchParams.get('page') ?? '1');
  const search = searchParams.get('search') ?? undefined;
  const industry = searchParams.get('industry') ?? undefined;

  const { data, isLoading, isFetching } = usePublicCompanies({ page, limit: 12, search, industry });
  const { data: allCompaniesData } = usePublicCompanies({ limit: 100 });

  const companies = data?.companies ?? [];
  const pagination = data?.pagination;

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

  return (
    <div className="bg-background">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl"
          >
            Companies
          </motion.h1>
          <p className="mt-2 max-w-xl text-text-secondary">Explore the companies in the CUET Placement Network directory.</p>

          <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search companies"
                aria-label="Search companies"
              />
            </div>
            <div className="sm:w-56">
              <Select
                placeholder="Industry"
                value={industry ?? ''}
                onValueChange={(value) => updateParams({ industry: value })}
                options={industryOptions}
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
            <Building2 className="h-10 w-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-base font-medium text-text">No companies match your search</p>
            <p className="max-w-sm text-sm text-text-muted">Try a different keyword or clear your filters.</p>
          </div>
        ) : (
          <div
            className={cn(
              'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-opacity',
              isFetching && 'opacity-60'
            )}
          >
            {companies.map((company) => (
              <PublicCompanyCard key={company.companyId} company={company} />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
