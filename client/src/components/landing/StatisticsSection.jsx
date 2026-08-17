import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLandingData } from '@/components/landing/useLandingData';

export function StatisticsSection() {
  const { isLoading, totalOpenJobs, companies, categories } = useLandingData();

  const stats = [
    { label: 'Open Roles', value: totalOpenJobs },
    { label: 'Hiring Companies', value: companies.length },
    { label: 'Job Categories', value: categories.length },
  ];

  return (
    <section className="bg-background-alt">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex flex-col items-center gap-1.5 text-center sm:items-start sm:text-left"
            >
              {isLoading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <p className="font-display text-5xl font-semibold tracking-tight text-text">{stat.value}</p>
              )}
              <p className="text-sm font-medium text-text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
