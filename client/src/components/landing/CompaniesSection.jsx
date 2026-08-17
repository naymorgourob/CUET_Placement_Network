import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { useLandingData } from '@/components/landing/useLandingData';

export function CompaniesSection() {
  const { isLoading, companies } = useLandingData();

  if (!isLoading && companies.length === 0) {
    return null;
  }

  return (
    <section id="companies" className="bg-background scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Employers</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Companies Hiring CUET Talent
          </h2>
        </div>

        {isLoading ? (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {companies.map((company, index) => (
              <motion.div
                key={company.companyId}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-hover"
              >
                <CompanyLogo name={company.name} logoPath={company.logoPath} size="lg" />
                <div>
                  <p className="text-sm font-semibold text-text">{company.name}</p>
                  {company.industry && <p className="mt-0.5 text-xs text-text-muted">{company.industry}</p>}
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-primary">
                  <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {company.openJobCount} open {company.openJobCount === 1 ? 'role' : 'roles'}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
