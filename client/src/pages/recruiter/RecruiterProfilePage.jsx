import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { recruiterProfileSchema, companyProfileSchema } from '@/features/recruiter/recruiterSchemas';
import {
  useRecruiterProfile,
  useUpdateRecruiterProfile,
  useCompanyProfile,
  useUpdateCompanyProfile,
} from '@/features/recruiter/recruiterQueries';

function RecruiterInformationCard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: profile, isLoading } = useRecruiterProfile();
  const updateProfile = useUpdateRecruiterProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(recruiterProfileSchema),
    defaultValues: { designation: '', phone: '' },
  });

  useEffect(() => {
    if (profile) {
      reset({
        designation: profile.designation ?? '',
        phone: profile.phone ?? '',
      });
    }
  }, [profile, reset]);

  async function onSubmit(values) {
    const payload = {
      designation: values.designation || null,
      phone: values.phone || null,
    };

    try {
      await updateProfile.mutateAsync(payload);
      showToast({ variant: 'success', title: 'Recruiter profile updated.' });
    } catch (error) {
      const message = error.response?.data?.message ?? 'Failed to update recruiter profile.';
      showToast({ variant: 'danger', title: 'Update failed', description: message });
    }
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Recruiter Information</p>
        <div className="mt-3 flex items-center gap-4">
          <Avatar name={user?.fullName} size="lg" />
          <div>
            <CardTitle>{user?.fullName}</CardTitle>
            <p className="text-sm text-text-muted">{user?.email}</p>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardBody className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Designation"
                placeholder="e.g. Talent Acquisition Lead"
                error={errors.designation?.message}
                {...register('designation')}
              />
              <Input
                label="Phone"
                placeholder="e.g. +8801XXXXXXXXX"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
          )}
        </CardBody>

        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            leftIcon={Save}
            isLoading={updateProfile.isPending}
            disabled={updateProfile.isPending || !isDirty}
          >
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function CompanyInformationCard() {
  const { showToast } = useToast();
  const { data: company, isLoading, isError } = useCompanyProfile();
  const updateCompany = useUpdateCompanyProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
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
    } catch (error) {
      const message = error.response?.data?.message ?? 'Failed to update company profile.';
      showToast({ variant: 'danger', title: 'Update failed', description: message });
    }
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Company Information</p>
        <CardTitle className="mt-3">{company?.name || 'Your Company'}</CardTitle>
        <CardDescription>
          {isError ? 'Set up your company to start posting jobs.' : 'Shown to students on every job you post.'}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardBody className="flex flex-col gap-5">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-14 w-14 rounded-[var(--radius-control)]" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <SkeletonText lines={3} />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 border-b border-border pb-5">
                <CompanyLogo name={company?.name} logoPath={company?.logoPath} size="lg" />
                <div>
                  <p className="text-sm font-medium text-text">Company Logo</p>
                  <p className="text-xs text-text-muted">Logo upload is not available yet.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                />
              </div>

              <Textarea
                label="Description"
                placeholder="Tell candidates about your company..."
                rows={5}
                error={errors.description?.message}
                {...register('description')}
              />
            </>
          )}
        </CardBody>

        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            leftIcon={Save}
            isLoading={updateCompany.isPending}
            disabled={updateCompany.isPending || (!isDirty && !isError)}
          >
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export function RecruiterProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-xl font-semibold text-text"
      >
        My Profile
      </motion.h1>

      <div className="flex max-w-2xl flex-col gap-6">
        <RecruiterInformationCard />
        <CompanyInformationCard />
      </div>
    </div>
  );
}
