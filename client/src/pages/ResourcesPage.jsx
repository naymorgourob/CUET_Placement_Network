import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, ArrowRight, BookOpen, SearchX } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { ResourceCard } from '@/components/shared/ResourceCard';
import { ResourceCoverImage } from '@/components/shared/ResourceCoverImage';
import { usePublicResources, useFeaturedResource } from '@/features/public/publicResourcesQueries';
import { RESOURCE_CATEGORIES, getResourceCategory } from '@/utils/resourceCategories';
import { cn } from '@/utils/cn';

export function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const page = Number(searchParams.get('page') ?? '1');
  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;

  const { data, isLoading, isFetching } = usePublicResources({ page, limit: 9, search, category });
  const { data: featured, isLoading: isFeaturedLoading } = useFeaturedResource();

  const resources = data?.resources ?? [];
  const pagination = data?.pagination;
  const showFeatured = !search && !category && page === 1;

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

  function handleClearSearch() {
    setSearchInput('');
    updateParams({ search: undefined, category: undefined });
  }

  const featuredCategory = featured ? getResourceCategory(featured.category) : null;

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
            Resources
          </motion.h1>
          <p className="mt-1 text-lg text-text-secondary">Learn, prepare and build your career.</p>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            Practical career guidance, resume advice, interview preparation, and industry insights for CUET students.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <Input
                className="pl-9"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search resources..."
                aria-label="Search resources"
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

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateParams({ category: undefined })}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                !category
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-text-muted hover:border-border-strong hover:text-text'
              )}
            >
              All
            </button>
            {RESOURCE_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => updateParams({ category: cat.value })}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                  category === cat.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-text-muted hover:border-border-strong hover:text-text'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        {showFeatured && (isFeaturedLoading || featured) && (
          <div className="mb-12">
            {isFeaturedLoading ? (
              <Skeleton className="h-64 w-full rounded-2xl" />
            ) : (
              <Link to={`/resources/${featured.slug}`} className="block">
                <div className="group grid overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow duration-200 hover:shadow-hover md:grid-cols-2">
                  <div className="aspect-[16/9] md:aspect-auto md:h-full">
                    <ResourceCoverImage
                      coverImagePath={featured.coverImagePath}
                      category={featured.category}
                      iconClassName="h-12 w-12"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
                    <Badge variant="info" icon={null} className="w-fit">
                      {featuredCategory.label}
                    </Badge>
                    <h2 className="text-xl font-semibold tracking-tight text-text transition-colors group-hover:text-primary sm:text-2xl">
                      {featured.title}
                    </h2>
                    <p className="line-clamp-3 text-sm leading-relaxed text-text-muted">{featured.excerpt}</p>
                    <div className="mt-2 flex items-center gap-4">
                      {featured.readingTimeMinutes && (
                        <span className="flex items-center gap-1 text-sm text-text-muted">
                          <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                          {featured.readingTimeMinutes} min read
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-sm font-medium text-primary">
                        Read Article
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
            {search || category ? (
              <>
                <SearchX className="h-10 w-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-base font-medium text-text">
                  {search ? 'No resources found.' : 'No resources available in this category yet.'}
                </p>
                {search && (
                  <Button variant="outline" size="sm" onClick={handleClearSearch}>
                    Clear Search
                  </Button>
                )}
              </>
            ) : (
              <>
                <BookOpen className="h-10 w-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-base font-medium text-text">Career guidance and learning resources will appear here.</p>
              </>
            )}
          </div>
        ) : (
          <div
            className={cn(
              'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-opacity',
              isFetching && 'opacity-60'
            )}
          >
            {resources.map((resource) => (
              <ResourceCard key={resource.resourceId} resource={resource} />
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
