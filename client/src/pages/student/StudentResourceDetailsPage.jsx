import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { ResourceCoverImage } from '@/components/shared/ResourceCoverImage';
import { StudentResourceCard } from '@/features/student/components/StudentResourceCard';
import { usePublicResourceDetails } from '@/features/public/publicResourcesQueries';
import { getResourceCategory } from '@/utils/resourceCategories';

export function StudentResourceDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = usePublicResourceDetails(slug);
  const resource = data?.resource;
  const related = data?.related ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <SkeletonText lines={6} />
      </div>
    );
  }

  if (isError || !resource) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">Resource not found.</p>
        <Link to="/student/resources">
          <Button variant="outline">Back to Resources</Button>
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
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px] lg:items-start">
        <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Badge variant="info" icon={null}>
            {category.label}
          </Badge>

          <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl">
            {resource.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-text-muted">
            {resource.author && <span>By {resource.author}</span>}
            {resource.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                {new Date(resource.publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {resource.readingTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                {resource.readingTimeMinutes} min read
              </span>
            )}
          </div>

          <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
            <ResourceCoverImage
              coverImagePath={resource.coverImagePath}
              category={resource.category}
              iconClassName="h-14 w-14"
            />
          </div>

          <div className="mt-8 whitespace-pre-line text-[15px] leading-[1.8] text-text-secondary">
            {resource.content}
          </div>

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

        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-6"
        >
          <h2 className="text-sm font-semibold text-text">About this resource</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-text-muted">Category</span>
              <span className="font-medium text-text">{category.label}</span>
            </div>
            {resource.author && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">Author</span>
                <span className="font-medium text-text">{resource.author}</span>
              </div>
            )}
            {resource.readingTimeMinutes && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">Read time</span>
                <span className="font-medium text-text">{resource.readingTimeMinutes} min</span>
              </div>
            )}
          </div>
        </motion.aside>
      </div>

      {related.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
          <h2 className="text-lg font-semibold text-text">Related Resources</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <StudentResourceCard key={item.resourceId} resource={item} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
