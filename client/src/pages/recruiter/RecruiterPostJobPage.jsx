import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, Clock, Briefcase, AlertTriangle, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { jobFormSchema } from '@/features/recruiter/recruiterSchemas';
import { useCreateJob, useCompanyProfile } from '@/features/recruiter/recruiterQueries';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

const JOB_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'part-time', label: 'Part-time' },
];

const JOB_TYPE_LABEL = {
  'full-time': 'Full-time',
  internship: 'Internship',
  'part-time': 'Part-time',
};

const EMPTY_VALUES = {
  title: '',
  description: '',
  requirements: '',
  location: '',
  jobType: '',
  deadline: '',
};

function FormSection({ title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="mt-0.5 text-sm text-text-muted">{description}</p>}
      </CardHeader>
      <CardBody className="flex flex-col gap-4">{children}</CardBody>
    </Card>
  );
}

export function RecruiterPostJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('form');
  const [publishedJob, setPublishedJob] = useState(null);

  const { data: company, isLoading: isCompanyLoading } = useCompanyProfile();
  const createJob = useCreateJob();

  const {
    register,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: EMPTY_VALUES,
    mode: 'onBlur',
  });

  async function handleReview() {
    const valid = await trigger();
    if (valid) {
      setStep('review');
    }
  }

  function handlePublish() {
    const values = getValues();
    const payload = {
      title: values.title,
      description: values.description,
      requirements: values.requirements || null,
      location: values.location || null,
      jobType: values.jobType || undefined,
      deadline: values.deadline || null,
    };

    createJob.mutate(payload, {
      onSuccess: (job) => {
        setPublishedJob(job);
        setStep('success');
      },
    });
  }

  const hasCompany = Boolean(company);
  const companyData = company;
  const values = getValues();

  if (step === 'success' && publishedJob) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-7 w-7 text-success" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-text">Job Published Successfully</h1>
        <div>
          <p className="text-base font-medium text-text">{publishedJob.title}</p>
          <p className="text-sm text-text-muted">{companyData?.name}</p>
        </div>
        <p className="text-sm text-text-muted">Your job posting is now available to candidates.</p>
        <div className="mt-2 flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(`/recruiter/jobs/${publishedJob.jobId}`)}>
            View Job
          </Button>
          <Button onClick={() => navigate('/recruiter/jobs')}>Manage My Jobs</Button>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <motion.div {...fadeUp}>
          <Breadcrumbs items={[{ label: 'Dashboard', to: '/recruiter/dashboard' }, { label: 'Post a Job' }]} className="mb-3" />
          <h1 className="text-xl font-semibold text-text">Review &amp; Publish</h1>
          <p className="mt-1 text-sm text-text-muted">Check the details below before publishing your job posting.</p>
        </motion.div>

        <motion.div {...fadeUp}>
          <Card>
            <CardBody className="flex flex-col gap-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-text">{values.title}</h2>
                  <p className="mt-1 text-sm text-text-muted">{companyData?.name}</p>
                </div>
                <Badge variant="success">Open</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted">
                {values.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    {values.location}
                  </span>
                )}
                {values.jobType && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    {JOB_TYPE_LABEL[values.jobType]}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  {values.deadline ? `Deadline: ${new Date(values.deadline).toLocaleDateString()}` : 'No deadline'}
                </span>
              </div>

              <div className="border-t border-border pt-5">
                <h3 className="text-sm font-semibold text-text">Description</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">{values.description}</p>
              </div>

              {values.requirements && (
                <div className="border-t border-border pt-5">
                  <h3 className="text-sm font-semibold text-text">Requirements</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">{values.requirements}</p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {createJob.isError && (
          <motion.div {...fadeUp}>
            <Card className="border-danger/40">
              <CardBody className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-text">Unable to publish this job.</p>
                  <p className="mt-1 text-sm text-text-muted">
                    {createJob.error?.response?.data?.message ?? 'Something went wrong. Please try again.'}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        <motion.div {...fadeUp} className="flex items-center justify-between gap-3">
          <Button variant="outline" leftIcon={ArrowLeft} onClick={() => setStep('form')} disabled={createJob.isPending}>
            Back to Edit
          </Button>
          <Button onClick={handlePublish} isLoading={createJob.isPending}>
            {createJob.isPending ? 'Publishing...' : 'Publish Job'}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <motion.div {...fadeUp}>
        <Breadcrumbs items={[{ label: 'Dashboard', to: '/recruiter/dashboard' }, { label: 'Post a Job' }]} className="mb-3" />
        <h1 className="text-xl font-semibold text-text">Post a New Job</h1>
        <p className="mt-1 text-sm text-text-muted">Create a job posting and reach qualified candidates.</p>
      </motion.div>

      <motion.div {...fadeUp}>
        <FormSection title="Basic Information">
          <Input
            label="Job Title"
            required
            placeholder="e.g. Software Engineer"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-text">Company</p>
            {isCompanyLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : hasCompany ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
                <CompanyLogo name={companyData?.name} logoPath={companyData?.logoPath} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{companyData?.name}</p>
                  <p className="truncate text-xs text-text-muted">{companyData?.industry ?? 'Industry not set'}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-warning/40 bg-warning-bg/10 px-3 py-2.5">
                <Building2 className="h-5 w-5 shrink-0 text-warning" strokeWidth={1.75} aria-hidden="true" />
                <p className="text-sm text-text">
                  You need a company profile before posting a job.{' '}
                  <a href="/recruiter/company" className="font-medium text-primary hover:text-primary-hover">
                    Set up company
                  </a>
                </p>
              </div>
            )}
            <p className="text-xs text-text-muted">This job will be posted under your company automatically.</p>
          </div>
        </FormSection>
      </motion.div>

      <motion.div {...fadeUp}>
        <FormSection title="Job Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Location" placeholder="e.g. Chattogram" error={errors.location?.message} {...register('location')} />

            <Controller
              control={control}
              name="jobType"
              render={({ field }) => (
                <Select
                  label="Job Type"
                  placeholder="Select job type"
                  value={field.value}
                  onValueChange={field.onChange}
                  options={JOB_TYPE_OPTIONS}
                  error={errors.jobType?.message}
                />
              )}
            />
          </div>

          <Input
            label="Application Deadline"
            type="date"
            helperText="Optional — leave blank if there's no fixed deadline."
            error={errors.deadline?.message}
            {...register('deadline')}
          />
        </FormSection>
      </motion.div>

      <motion.div {...fadeUp}>
        <FormSection title="Description">
          <Textarea
            label="Job Description"
            required
            rows={6}
            placeholder="Describe the role, responsibilities, team, and what the candidate will be working on."
            error={errors.description?.message}
            {...register('description')}
          />
        </FormSection>
      </motion.div>

      <motion.div {...fadeUp}>
        <FormSection title="Requirements">
          <Textarea
            label="Requirements"
            rows={4}
            placeholder="List required skills, qualifications, and experience..."
            error={errors.requirements?.message}
            {...register('requirements')}
          />
        </FormSection>
      </motion.div>

      <motion.div {...fadeUp} className="flex items-center justify-end gap-3">
        <Button rightIcon={ArrowRight} onClick={handleReview} disabled={!hasCompany}>
          Review &amp; Publish
        </Button>
      </motion.div>
    </div>
  );
}
