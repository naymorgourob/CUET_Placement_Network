import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Briefcase, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { JobCard } from '@/features/student/components/JobCard';
import { StudentCompanyCard } from '@/features/student/components/StudentCompanyCard';
import { usePublicCompanyDetails, usePublicCompanies } from '@/features/public/publicCompaniesQueries';
import { useMyApplications, useSavedJobIds, useSaveJob, useUnsaveJob, useJobs } from '@/features/student/studentQueries';

export function StudentCompanyDetailsPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const { data: company, isLoading, isError, refetch } = usePublicCompanyDetails(companyId);
  const { data: jobsData, isLoading: isJobsLoading } = useJobs(
    company ? { companyId: company.companyId, limit: 100 } : undefined
  );
  const { data: relatedData } = usePublicCompanies(
    company?.industry ? { industry: company.industry, limit: 5 } : undefined
  );
  const { data: applicationsData } = useMyApplications({ page: 1, limit: 100 });
  const { data: savedJobIds } = useSavedJobIds();
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const openJobs = company ? (jobsData?.jobs ?? []) : [];
  const appliedJobIds = new Set((applicationsData?.applications ?? []).map((application) => application.jobId));
  const savedIdSet = new Set(savedJobIds ?? []);
  const relatedCompanies = (relatedData?.companies ?? [])
    .filter((related) => related.companyId !== company?.companyId)
    .slice(0, 4);

  function handleToggleSave(jobId, isSaved) {
    if (isSaved) {
      unsaveJob.mutate(jobId);
    } else {
      saveJob.mutate(jobId);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Skeleton className="h-4 w-16" />
        <Card>
          <CardBody className="p-8">
            <div className="flex items-start gap-4">
              <Skeleton className="h-20 w-20 shrink-0 rounded-[var(--radius-control)]" />
              <div className="flex-1">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="mt-2 h-4 w-1/3" />
              </div>
            </div>
            <SkeletonText lines={4} className="mt-6" />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">
          {isError ? 'Unable to load this company.' : 'Company not found.'}
        </p>
        {isError ? (
          <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetch()}>
            Try Again
          </Button>
        ) : (
          <Link to="/student/companies">
            <Button variant="outline">Back to Companies</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
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

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <Card>
          <CardBody className="flex flex-col gap-5 p-8">
            <div className="flex flex-wrap items-start gap-4">
              <CompanyLogo name={company.name} logoPath={company.logoPath} size="xl" />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold tracking-tight text-text">{company.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                  {company.industry && <span>{company.industry}</span>}
                </div>
              </div>
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="shrink-0">
                  <Button variant="outline" leftIcon={Globe}>
                    Visit Website
                  </Button>
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {company.industry && <Badge variant="default">{company.industry}</Badge>}
              <Badge variant={company.openJobCount > 0 ? 'success' : 'default'} icon={Briefcase}>
                {company.openJobCount} {company.openJobCount === 1 ? 'open role' : 'open roles'}
              </Badge>
            </div>

            <div className="border-t border-border pt-5">
              <h2 className="text-sm font-semibold text-text">About</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                {company.description || 'Company information is currently unavailable.'}
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.05 }}>
        <h2 className="text-lg font-semibold text-text">Open Positions at {company.name}</h2>

        {isJobsLoading ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : openJobs.length === 0 ? (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-border bg-surface py-12 text-center">
            <Briefcase className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm font-semibold text-text">No open positions right now.</p>
            <p className="max-w-sm text-sm text-text-muted">
              You can still explore this company's profile and check back later.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {openJobs.map((job) => (
              <JobCard
                key={job.jobId}
                job={job}
                hasApplied={appliedJobIds.has(job.jobId)}
                isSaved={savedIdSet.has(job.jobId)}
                onToggleSave={handleToggleSave}
                isSaveLoading={saveJob.isPending || unsaveJob.isPending}
              />
            ))}
          </div>
        )}
      </motion.div>

      {relatedCompanies.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
          <h2 className="text-lg font-semibold text-text">You may also like</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedCompanies.map((related) => (
              <StudentCompanyCard key={related.companyId} company={related} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
