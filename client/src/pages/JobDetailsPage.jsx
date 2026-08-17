import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Building2, Calendar, MapPin, LogIn } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { useAuth } from '@/hooks/useAuth';
import { usePublicJobDetails } from '@/features/public/publicJobsQueries';

const JOB_TYPE_LABELS = {
  'full-time': 'Full-time',
  internship: 'Internship',
  'part-time': 'Part-time',
};

export function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const { data: job, isLoading, isError } = usePublicJobDetails(jobId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-1/2" />
        <SkeletonText lines={4} className="mt-6" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-base font-semibold text-text">Job not found</p>
        <p className="mt-1 text-sm text-text-muted">This opportunity may have been closed or removed.</p>
        <Link to="/jobs" className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover">
          Back to job listings
        </Link>
      </div>
    );
  }

  const isClosed = job.status !== 'open';
  const isDeadlinePassed = job.deadline && new Date(job.deadline) < new Date();

  function renderAction() {
    if (isClosed || isDeadlinePassed) {
      return <Badge variant="danger">{isClosed ? 'Closed' : 'Deadline passed'}</Badge>;
    }

    if (isAuthenticated && role === 'student') {
      return (
        <Link to={`/student/jobs/${job.jobId}`}>
          <Button>Apply Now</Button>
        </Link>
      );
    }

    if (isAuthenticated) {
      return null;
    }

    return (
      <Link to="/login" state={{ from: { pathname: `/jobs/${job.jobId}` } }}>
        <Button leftIcon={LogIn}>Log In to Apply</Button>
      </Link>
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
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <CompanyLogo name={job.Company?.name} logoPath={job.Company?.logoPath} size="lg" />
                  <div>
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-text">{job.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                        {job.Company?.name}
                      </span>
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                          {job.location}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                          Apply by {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">{renderAction()}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="info" icon={Briefcase}>
                  {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
                </Badge>
                {job.Company?.industry && <Badge variant="default">{job.Company.industry}</Badge>}
              </div>

              <div className="border-t border-border pt-5">
                <h2 className="text-sm font-semibold text-text">Description</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-secondary">{job.description}</p>
              </div>

              {job.requirements && (
                <div>
                  <h2 className="text-sm font-semibold text-text">Requirements</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                    {job.requirements}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
