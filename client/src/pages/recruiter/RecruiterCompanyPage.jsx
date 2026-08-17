import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Pencil,
  Save,
  X,
  Camera,
  Globe,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  Inbox,
  ArrowRight,
  MapPin,
  AlertTriangle,
  RefreshCcw,
  Plus,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { JobStatusBadge } from '@/features/recruiter/components/JobStatusBadge';
import { useToast } from '@/hooks/useToast';
import { companyProfileSchema } from '@/features/recruiter/recruiterSchemas';
import {
  useCompanyProfile,
  useUpdateCompanyProfile,
  useUploadCompanyLogo,
  useMyJobs,
  useRecruiterDashboard,
} from '@/features/recruiter/recruiterQueries';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

const JOB_TYPE_LABEL = {
  'full-time': 'Full Time',
  internship: 'Internship',
  'part-time': 'Part Time',
};

function StatTile({ icon: Icon, label, value, isLoading }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3.5 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-muted">{label}</p>
          {isLoading ? (
            <Skeleton className="mt-1.5 h-6 w-10" />
          ) : (
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-text">{value}</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function OpenJobRow({ job }) {
  return (
    <Link
      to={`/recruiter/jobs/${job.jobId}`}
      className="flex min-w-0 items-center gap-4 rounded-lg border border-border p-4 transition-colors duration-100 hover:border-border-strong hover:bg-surface-muted"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-text">{job.title}</p>
          <JobStatusBadge status={job.status} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted">
            {JOB_TYPE_LABEL[job.jobType] ?? job.jobType}
          </span>
          {job.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted">
              <MapPin className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
              {job.location}
            </span>
          )}
          <span className="text-[11px] font-medium text-text-muted">
            {job.applicationCount} {job.applicationCount === 1 ? 'application' : 'applications'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function RecruiterCompanyPage() {
  const { data: company, isLoading, isError, error, refetch } = useCompanyProfile();
  const { data: dashboard, isLoading: isStatsLoading } = useRecruiterDashboard();
  const { data: jobs, isLoading: isJobsLoading } = useMyJobs();
  const updateCompany = useUpdateCompanyProfile();
  const uploadLogo = useUploadCompanyLogo();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: { name: '', industry: '', website: '', description: '' },
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name ?? '',
        industry: company.industry ?? '',
        website: company.website ?? '',
        description: company.description ?? '',
      });
    }
  }, [company, reset]);

  async function onSubmit(values) {
    const payload = {
      name: values.name,
      industry: values.industry || null,
      website: values.website || null,
      description: values.description || null,
    };

    try {
      await updateCompany.mutateAsync(payload);
      showToast({ variant: 'success', title: 'Company profile updated.' });
      setIsEditing(false);
    } catch (error) {
      const message = error.response?.data?.message ?? 'Unable to update company information.';
      showToast({ variant: 'danger', title: 'Update failed', description: message });
    }
  }

  function handleCancelEdit() {
    reset({
      name: company?.name ?? '',
      industry: company?.industry ?? '',
      website: company?.website ?? '',
      description: company?.description ?? '',
    });
    setIsEditing(false);
  }

  function handleLogoClick() {
    fileInputRef.current?.click();
  }

  function handleLogoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    uploadLogo.mutate(file, {
      onSuccess: () => {
        showToast({ variant: 'success', title: 'Company logo updated.' });
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to upload logo.';
        showToast({ variant: 'danger', title: 'Upload failed', description: message });
      },
    });

    event.target.value = '';
  }

  const activeJobs = (jobs ?? []).filter((job) => job.status === 'open').slice(0, 5);

  const isNoCompanyYet = isError && error?.response?.status === 404;

  if (isError && !isNoCompanyYet) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">Unable to load company information.</p>
        <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const showCreateForm = isNoCompanyYet;

  return (
    <div className="flex flex-col gap-6">
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-semibold text-text">Company Profile</h1>
        <p className="mt-1 text-sm text-text-muted">Manage the information candidates see about your company.</p>
      </motion.div>

      {isLoading ? (
        <motion.div {...fadeUp}>
          <Card>
            <CardBody className="flex items-center gap-4 p-6">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-2 h-4 w-24" />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <motion.div {...fadeUp}>
          <Card>
            <CardBody className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <CompanyLogo name={company?.name} logoPath={company?.logoPath} size="xl" />
                  {company && (
                    <button
                      type="button"
                      onClick={handleLogoClick}
                      disabled={uploadLogo.isPending}
                      aria-label="Change logo"
                      className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-text-muted shadow-sm hover:bg-surface-muted hover:text-text disabled:opacity-50"
                    >
                      <Camera className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">{company?.name ?? 'Set up your company'}</h2>
                  <p className="mt-0.5 text-sm text-text-muted">
                    {company?.industry ?? (company ? 'Industry not set' : 'Create a company profile to start posting jobs.')}
                  </p>
                </div>
              </div>
              {company && !isEditing && (
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/companies/${company.companyId}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" rightIcon={ExternalLink}>
                      View Public Profile
                    </Button>
                  </Link>
                  <Button leftIcon={Pencil} onClick={() => setIsEditing(true)}>
                    Edit Company
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      )}

      {!isLoading && company && (
        <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-3">
          <StatTile icon={Briefcase} label="Total Jobs" value={dashboard?.totalJobs ?? 0} isLoading={isStatsLoading} />
          <StatTile icon={CheckCircle2} label="Open Jobs" value={dashboard?.activeJobs ?? 0} isLoading={isStatsLoading} />
          <StatTile
            icon={Inbox}
            label="Applications Received"
            value={dashboard?.applicationStats?.totalApplications ?? 0}
            isLoading={isStatsLoading}
          />
        </motion.div>
      )}

      {(isLoading || company || showCreateForm) && (
        <motion.div {...fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : isEditing || showCreateForm ? (
                <form id="company-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Company Name"
                      required
                      placeholder="e.g. Acme Corp"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      label="Industry"
                      placeholder="e.g. Software"
                      error={errors.industry?.message}
                      {...register('industry')}
                    />
                    <Input
                      label="Website"
                      placeholder="https://example.com"
                      error={errors.website?.message}
                      {...register('website')}
                      className="sm:col-span-2"
                    />
                  </div>

                  <Textarea
                    label="Description"
                    placeholder="Tell candidates about your company..."
                    rows={5}
                    error={errors.description?.message}
                    {...register('description')}
                  />

                  <div className="flex justify-end gap-2 border-t border-border pt-5">
                    {!showCreateForm && (
                      <Button type="button" variant="outline" leftIcon={X} onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" leftIcon={Save} isLoading={updateCompany.isPending}>
                      {showCreateForm ? 'Create Company' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-sm font-medium text-text">Website</p>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
                      >
                        <Globe className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                        Visit Website
                        <ExternalLink className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-text-muted">Not added</p>
                    )}
                  </div>

                  <div className="border-t border-border pt-5">
                    <p className="text-sm font-medium text-text">Description</p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-text-secondary">
                      {company.description || 'Company description is not available yet.'}
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      )}

      {!isLoading && company && (
        <motion.div {...fadeUp}>
          <Card>
            <div className="flex items-center justify-between gap-3 border-b border-border p-6 pb-4">
              <h2 className="text-base font-semibold text-text">Open Positions</h2>
              <Link
                to="/recruiter/jobs"
                className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
            <CardBody className="flex flex-col gap-3">
              {isJobsLoading ? (
                Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-[76px] w-full rounded-lg" />)
              ) : activeJobs.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <Briefcase className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-sm font-medium text-text">No open positions right now.</p>
                  <Link to="/recruiter/jobs/new" className="mt-1">
                    <Button variant="outline" size="sm" leftIcon={Plus}>
                      Post a Job
                    </Button>
                  </Link>
                </div>
              ) : (
                activeJobs.map((job) => <OpenJobRow key={job.jobId} job={job} />)
              )}
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
