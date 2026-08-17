import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { PublicJobCard } from '@/components/shared/PublicJobCard';
import { useLandingData } from '@/components/landing/useLandingData';

export function FeaturedJobsSection() {
  const { isLoading, featuredJobs } = useLandingData();

  if (!isLoading && featuredJobs.length === 0) {
    return null;
  }

  return (
    <section className="bg-background-alt">
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Marketplace</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Featured Opportunities
            </h2>
            <p className="mt-3 max-w-xl text-text-secondary">
              Explore opportunities from companies looking for talented candidates.
            </p>
          </div>
          <Link
            to="/jobs"
            className="group hidden items-center gap-1.5 text-sm font-medium text-text transition-colors hover:text-primary sm:flex"
          >
            View all jobs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredJobs.map((job, index) => (
              <motion.div
                key={job.jobId}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: (index % 4) * 0.06 }}
              >
                <PublicJobCard job={job} />
              </motion.div>
            ))}
          </div>
        )}

        <Link
          to="/jobs"
          className="mt-8 flex items-center justify-center gap-1.5 text-sm font-medium text-text transition-colors hover:text-primary sm:hidden"
        >
          <Briefcase className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          View all jobs
        </Link>
      </div>
    </section>
  );
}
