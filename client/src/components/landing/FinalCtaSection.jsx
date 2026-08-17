import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getRoleHomePath } from '@/utils/roleRedirect';

export function FinalCtaSection() {
  const { isAuthenticated, role } = useAuth();

  const secondaryAction = isAuthenticated
    ? { to: getRoleHomePath(role), label: 'Go to Dashboard' }
    : { to: '/register', label: 'Create Your Profile' };

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl"
        >
          Your Next Opportunity Is Waiting.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mx-auto mt-4 max-w-lg text-text-secondary"
        >
          Discover opportunities, connect with companies, and take the next step in your career.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/jobs">
            <span className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
              Explore Jobs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
            </span>
          </Link>
          <Link to={secondaryAction.to}>
            <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-text transition-colors hover:bg-surface-muted">
              {secondaryAction.label}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
