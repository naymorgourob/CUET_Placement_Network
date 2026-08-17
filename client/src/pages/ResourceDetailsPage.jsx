import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { ResourceCoverImage } from '@/components/shared/ResourceCoverImage';
import { ResourceCard } from '@/components/shared/ResourceCard';
import { usePublicResourceDetails } from '@/features/public/publicResourcesQueries';
import { getResourceCategory } from '@/utils/resourceCategories';

export function ResourceDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = usePublicResourceDetails(slug);
  const resource = data?.resource;
  const related = data?.related ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
        <SkeletonText lines={6} className="mt-6" />
      </div>
    );
  }

  if (isError || !resource) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-base font-semibold text-text">Resource not found</p>
        <p className="mt-1 text-sm text-text-muted">This article may have been unpublished or removed.</p>
        <Link to="/resources" className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover">
          Back to Resources
        </Link>
      </div>
    );
  }

  const category = getResourceCategory(resource.category);
  const tags = (resource.tags ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <div className="bg-background">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          type="button"
          onClick={() => navigate(-1)}
          className="flex w-fit items-center gap-1 text-sm text-text-muted hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Back
        </motion.button>

        <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Badge variant="info" icon={null}>
            {category.label}
          </Badge>

          <h1 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl">
            {resource.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-text-muted">
            <span>By {resource.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              {resource.publishedAt
                ? new Date(resource.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </span>
            {resource.readingTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                {resource.readingTimeMinutes} min read
              </span>
            )}
          </div>

          <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
            <ResourceCoverImage coverImagePath={resource.coverImagePath} category={resource.category} iconClassName="h-14 w-14" />
          </div>

          <div className="mt-8 whitespace-pre-line text-[15px] leading-[1.8] text-text-secondary">{resource.content}</div>

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.article>

        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mt-4"
          >
            <h2 className="text-lg font-semibold text-text">Related Resources</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ResourceCard key={item.resourceId} resource={item} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
