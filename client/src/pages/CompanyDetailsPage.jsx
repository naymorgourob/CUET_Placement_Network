import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Briefcase } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { PublicJobCard } from '@/components/shared/PublicJobCard';
import { usePublicCompanyDetails } from '@/features/public/publicCompaniesQueries';
import { usePublicJobs } from '@/features/public/publicJobsQueries';

export function CompanyDetailsPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const { data: company, isLoading, isError } = usePublicCompanyDetails(companyId);
  const { data: jobsData, isLoading: isJobsLoading } = usePublicJobs({
    company: company?.name,
    limit: 6,
  });

  const openJobs = company ? (jobsData?.jobs ?? []) : [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-1/2" />
        <SkeletonText lines={4} className="mt-6" />
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-base font-semibold text-text">Company not found</p>
        <p className="mt-1 text-sm text-text-muted">This company may not exist in the directory.</p>
        <Link to="/companies" className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover">
          Back to companies
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          type="button"
          onClick={() => navigate(-1)}
          className="flex w-fit items-center gap-1 text-sm text-text-muted hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Back
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Card>
            <CardBody className="flex flex-col gap-5 p-8">
              <div className="flex flex-wrap items-start gap-4">
                <CompanyLogo name={company.name} logoPath={company.logoPath} size="xl" />
                <div className="min-w-0 flex-1">
                  <h1 className="font-display text-2xl font-semibold tracking-tight text-text">{company.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <Globe className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {company.industry && <Badge variant="default">{company.industry}</Badge>}
                {company.openJobCount > 0 && (
                  <Badge variant="success" icon={Briefcase}>
                    {company.openJobCount} open {company.openJobCount === 1 ? 'role' : 'roles'}
                  </Badge>
                )}
              </div>

              {company.description && (
                <div className="border-t border-border pt-5">
                  <h2 className="text-sm font-semibold text-text">About</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                    {company.description}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {company.openJobCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
            <h2 className="text-lg font-semibold text-text">Open Roles</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {isJobsLoading
                ? Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-48 rounded-2xl" />)
                : openJobs.map((job) => <PublicJobCard key={job.jobId} job={job} compact />)}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
