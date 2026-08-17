import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ShieldCheck, GraduationCap, Sparkles } from 'lucide-react';
import { HeroVisual } from '@/components/landing/HeroVisual';
import { HeroBackground } from '@/components/landing/HeroBackground';

const rise = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

const TRUST_INDICATORS = [
  { icon: ShieldCheck, label: 'Verified Opportunities' },
  { icon: GraduationCap, label: 'CUET Talent' },
  { icon: Sparkles, label: 'AI-Powered Career Tools' },
];

export function HeroSection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  }

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden pb-16 lg:pb-24">
      <HeroBackground />

      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[55%_45%] lg:gap-8 lg:px-8">
        <div className="flex flex-col">
          <motion.p
            {...rise}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary"
          >
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            CUET Career Network
          </motion.p>

          <motion.h1
            {...rise}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 font-display text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.02em] text-text sm:text-[2.75rem] lg:text-[3rem]"
          >
            Find the Right Opportunity.
            <br />
            <span className="italic text-primary">Build Your Future.</span>
          </motion.h1>

          <motion.p
            {...rise}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-md text-base leading-relaxed text-text-secondary lg:text-lg"
          >
            Connect with meaningful career opportunities and discover companies looking for CUET
            talent.
          </motion.p>

          <motion.form
            {...rise}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-md sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2.5 px-3 py-2">
              <Search className="h-4.5 w-4.5 shrink-0 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs, skills or companies"
                aria-label="Search jobs, skills or companies"
                className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="flex items-center gap-2.5 border-t border-border px-3 py-2 sm:w-44 sm:border-t-0">
              <MapPin className="h-4.5 w-4.5 shrink-0 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
                aria-label="Location"
                className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <Search className="h-4 w-4 sm:hidden" strokeWidth={2} aria-hidden="true" />
              Search Jobs
            </button>
          </motion.form>

          <motion.div
            {...rise}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3"
          >
            <Link
              to="/jobs"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Browse Jobs
            </Link>
          </motion.div>

          <motion.div
            {...rise}
            transition={{ duration: 0.5, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            {TRUST_INDICATORS.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-sm text-text-muted">
                <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          <HeroVisual />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />
      </div>
    </section>
  );
}
