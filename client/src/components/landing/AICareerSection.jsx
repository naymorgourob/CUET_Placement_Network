import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileSearch, Wand2, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const CAPABILITIES = [
  {
    icon: FileSearch,
    title: 'AI Resume Analysis',
    description: 'Understand your skills, education and experience.',
  },
  {
    icon: Wand2,
    title: 'Resume Improvement',
    description: 'Get actionable suggestions to strengthen your resume.',
  },
  {
    icon: Target,
    title: 'AI Job Match',
    description: 'See how well your resume matches a specific opportunity.',
  },
];

export function AICareerSection() {
  const { isAuthenticated, role } = useAuth();
  const ctaTo = isAuthenticated && role === 'student' ? '/student/resumes' : '/register';

  return (
    <section id="ai-tools" className="relative overflow-hidden bg-[#191A23] dark:bg-[#0A0B10] scroll-mt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 85% 10%, color-mix(in srgb, var(--color-primary) 30%, transparent), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto grid max-w-[1200px] gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:items-center lg:px-8">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            AI Career Tools
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your Resume. Smarter.
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Use AI-powered tools to understand your resume, improve it, and discover opportunities
            that match your skills.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            {CAPABILITIES.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="flex items-start gap-3.5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-sm text-white/60">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Link
            to={ctaTo}
            className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#191A23] transition-transform hover:-translate-y-0.5"
          >
            Explore AI Career Tools
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning-bg" />
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
              </div>
              <span className="text-xs font-medium text-white/50">resume_analysis.ai</span>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <div className="rounded-xl bg-white/[0.06] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-white/40">Extracted Skills</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {['React', 'Node.js', 'SQL', 'System Design'].map((skill) => (
                    <span key={skill} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-white/[0.06] p-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeDasharray="87 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-white">87%</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Match Score</p>
                  <p className="text-xs text-white/50">Software Engineer role</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-white/[0.06] p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
                <p className="text-xs leading-relaxed text-white/70">
                  Add measurable outcomes to your project descriptions to strengthen impact.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
