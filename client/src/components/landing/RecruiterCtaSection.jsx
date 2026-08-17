import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function RecruiterCtaSection() {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated && role !== 'recruiter') {
    return null;
  }

  const ctaTo = isAuthenticated ? '/recruiter/jobs' : '/register';

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[1.75rem] border border-border bg-gradient-to-br from-primary to-primary-active px-8 py-14 text-center sm:px-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
            <Building2 className="h-5.5 w-5.5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h2 className="relative mt-5 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Looking for Exceptional CUET Talent?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/80">
            Post your opportunity and connect with skilled students and graduates.
          </p>
          <Link
            to={ctaTo}
            className="group relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
          >
            Post a Job
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
