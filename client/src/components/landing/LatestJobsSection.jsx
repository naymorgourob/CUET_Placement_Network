import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { formatRelativeTime } from '@/utils/formatRelativeTime';
import { useLandingData } from '@/components/landing/useLandingData';

const JOB_TYPE_LABELS = {
  'full-time': 'Full-time',
  internship: 'Internship',
  'part-time': 'Part-time',
};

export function LatestJobsSection() {
  const { isLoading, latestJobs } = useLandingData();

  if (!isLoading && latestJobs.length === 0) {
    return null;
  }

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Fresh roles</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Latest Opportunities
            </h2>
          </div>
          <Link
            to="/jobs?sort=newest"
            className="group hidden items-center gap-1.5 text-sm font-medium text-text transition-colors hover:text-primary sm:flex"
          >
            View all jobs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {latestJobs.map((job, index) => (
              <motion.div
                key={job.jobId}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <Link
                  to={`/jobs/${job.jobId}`}
                  className="group flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-muted sm:flex-nowrap"
                >
                  <CompanyLogo name={job.Company?.name} logoPath={job.Company?.logoPath} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text transition-colors group-hover:text-primary">
                      {job.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                      <span>{job.Company?.name ?? 'Confidential company'}</span>
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                          {job.location}
                        </span>
                      )}
                      <span>{formatRelativeTime(job.createdAt)}</span>
                    </div>
                  </div>

                  <Badge variant="info" icon={null} className="shrink-0">
                    {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
                  </Badge>

                  <ArrowUpRight
                    className="hidden h-4 w-4 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100 sm:block"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
