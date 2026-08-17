import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { env } from '@/utils/env';

const FOOTER_COLUMNS = [
  {
    heading: 'Platform',
    links: [
      { to: '/', label: 'Home' },
      { to: '/jobs', label: 'Find Jobs' },
      { to: '/companies', label: 'Companies' },
      { to: '/resources', label: 'Resources' },
    ],
  },
  {
    heading: 'Students',
    links: [
      { to: '/student/dashboard', label: 'Dashboard' },
      { to: '/student/applications', label: 'Applications' },
      { to: '/student/resumes', label: 'Resume' },
      { to: '/student/resumes', label: 'AI Career Tools' },
    ],
  },
  {
    heading: 'Recruiters',
    links: [
      { to: '/recruiter/jobs', label: 'Post a Job' },
      { to: '/recruiter/jobs', label: 'Manage Jobs' },
      { to: '/recruiter/dashboard', label: 'Applicants' },
      { to: '/recruiter/company', label: 'Company Profile' },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="bg-[#191A23] dark:bg-[#0A0B10]">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-12 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <Logo className="[&_span:last-child]:text-white" />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              A single platform connecting CUET students, recruiters, and the placement cell.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
            {FOOTER_COLUMNS.map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/40">{heading}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={`${heading}-${link.label}`}>
                      <Link to={link.to} className="text-sm text-white/70 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {env.appName}. All rights reserved.
          </span>
          <span>Final Year Software Engineering Project</span>
        </div>
      </div>
    </footer>
  );
}
