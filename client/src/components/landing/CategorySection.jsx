import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Cog, LineChart, Megaphone, Palette, FlaskConical, LayoutGrid, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLandingData } from '@/components/landing/useLandingData';
import { cn } from '@/utils/cn';

const ICONS = {
  software: Code2,
  engineering: Cog,
  finance: LineChart,
  marketing: Megaphone,
  design: Palette,
  research: FlaskConical,
  other: LayoutGrid,
};

const TILE_ACCENTS = [
  'bg-primary/10 text-primary',
  'bg-accent-surface text-accent',
  'bg-info-surface text-info',
  'bg-success-surface text-success',
  'bg-warning-surface text-warning',
  'bg-surface-muted text-text-secondary',
];

export function CategorySection() {
  const { isLoading, categories } = useLandingData();

  if (!isLoading && categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1200px] px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pt-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Categories</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Explore Opportunities by Category
            </h2>
          </div>
          <Link
            to="/jobs"
            className="group hidden items-center gap-1.5 text-sm font-medium text-text transition-colors hover:text-primary sm:flex"
          >
            View all jobs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-32 w-[calc(50%-0.5rem)] rounded-2xl sm:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-0.8rem)]"
                />
              ))
            : categories.map((category, index) => {
                const Icon = ICONS[category.key] ?? LayoutGrid;
                const accent = TILE_ACCENTS[index % TILE_ACCENTS.length];

                return (
                  <motion.div
                    key={category.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-0.8rem)]"
                  >
                    <Link
                      to={`/jobs?search=${encodeURIComponent(category.label)}`}
                      className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-hover"
                    >
                      <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl', accent)}>
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <div className="mt-6">
                        <p className="font-semibold text-text">{category.label}</p>
                        <p className="mt-1 text-sm text-text-muted">
                          {category.count} open {category.count === 1 ? 'role' : 'roles'}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
