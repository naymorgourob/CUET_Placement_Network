import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { jobFormSchema } from '@/features/recruiter/recruiterSchemas';

const JOB_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'part-time', label: 'Part-time' },
];

const EMPTY_VALUES = {
  title: '',
  description: '',
  requirements: '',
  location: '',
  jobType: '',
  deadline: '',
};

function toDateInputValue(deadline) {
  if (!deadline) return '';
  return new Date(deadline).toISOString().slice(0, 10);
}

export function JobFormModal({ open, onOpenChange, job, onSubmit, isSubmitting }) {
  const isEditMode = Boolean(job);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(
        job
          ? {
              title: job.title ?? '',
              description: job.description ?? '',
              requirements: job.requirements ?? '',
              location: job.location ?? '',
              jobType: job.jobType ?? '',
              deadline: toDateInputValue(job.deadline),
            }
          : EMPTY_VALUES
      );
    }
  }, [open, job, reset]);

  function handleFormSubmit(values) {
    onSubmit({
      title: values.title,
      description: values.description,
      requirements: values.requirements || null,
      location: values.location || null,
      jobType: values.jobType || undefined,
      deadline: values.deadline || null,
    });
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? 'Edit Job' : 'Create Job'}
      description={isEditMode ? 'Update the details of this job posting.' : 'Fill in the details for your new job posting.'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="job-form" isLoading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Job'}
          </Button>
        </>
      }
    >
      <form id="job-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <Input label="Job Title" required placeholder="e.g. Software Engineer Intern" error={errors.title?.message} {...register('title')} />

        <Textarea
          label="Description"
          required
          rows={4}
          placeholder="Describe the role and responsibilities..."
          error={errors.description?.message}
          {...register('description')}
        />

        <Textarea
          label="Requirements"
          rows={3}
          placeholder="List required skills or qualifications..."
          error={errors.requirements?.message}
          {...register('requirements')}
        />

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
          label="Deadline"
          type="date"
          error={errors.deadline?.message}
          {...register('deadline')}
        />
      </form>
    </Modal>
  );
}
