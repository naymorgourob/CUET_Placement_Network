import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { resourceFormSchema } from '@/features/admin/adminSchemas';
import { RESOURCE_CATEGORIES } from '@/utils/resourceCategories';

const CATEGORY_OPTIONS = RESOURCE_CATEGORIES.map((category) => ({ value: category.value, label: category.label }));

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

const EMPTY_VALUES = {
  title: '',
  category: '',
  excerpt: '',
  content: '',
  author: '',
  tags: '',
  readingTimeMinutes: '',
  isFeatured: false,
  status: 'draft',
};

export function ResourceFormModal({ open, onOpenChange, resource, onSubmit, isSubmitting }) {
  const isEditMode = Boolean(resource);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(
        resource
          ? {
              title: resource.title ?? '',
              category: resource.category ?? '',
              excerpt: resource.excerpt ?? '',
              content: resource.content ?? '',
              author: resource.author ?? '',
              tags: resource.tags ?? '',
              readingTimeMinutes: resource.readingTimeMinutes ? String(resource.readingTimeMinutes) : '',
              isFeatured: Boolean(resource.isFeatured),
              status: resource.status ?? 'draft',
            }
          : EMPTY_VALUES
      );
    }
  }, [open, resource, reset]);

  function handleFormSubmit(values) {
    onSubmit({
      title: values.title,
      category: values.category,
      excerpt: values.excerpt,
      content: values.content,
      author: values.author || undefined,
      tags: values.tags || null,
      readingTimeMinutes: values.readingTimeMinutes ? Number(values.readingTimeMinutes) : null,
      isFeatured: Boolean(values.isFeatured),
      status: values.status,
    });
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? 'Edit Resource' : 'Create Resource'}
      description={isEditMode ? 'Update this career resource article.' : 'Publish a new career resource article for students.'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="resource-form" isLoading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Resource'}
          </Button>
        </>
      }
    >
      <form id="resource-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <Input label="Title" required placeholder="e.g. How to Write a Strong CV" error={errors.title?.message} {...register('title')} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                label="Category"
                required
                placeholder="Select category"
                value={field.value}
                onValueChange={field.onChange}
                options={CATEGORY_OPTIONS}
                error={errors.category?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="Status"
                required
                placeholder="Select status"
                value={field.value}
                onValueChange={field.onChange}
                options={STATUS_OPTIONS}
                error={errors.status?.message}
              />
            )}
          />
        </div>

        <Textarea
          label="Excerpt"
          required
          rows={2}
          placeholder="A short one to two sentence summary shown on resource cards..."
          error={errors.excerpt?.message}
          {...register('excerpt')}
        />

        <Textarea
          label="Content"
          required
          rows={10}
          placeholder="Full article content..."
          error={errors.content?.message}
          {...register('content')}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Author" placeholder="CUET Placement Network" error={errors.author?.message} {...register('author')} />
          <Input label="Reading Time (minutes)" type="number" min="1" max="120" error={errors.readingTimeMinutes?.message} {...register('readingTimeMinutes')} />
          <Input label="Tags" placeholder="Resume, FreshGraduate" error={errors.tags?.message} {...register('tags')} />
        </div>

        <Controller
          control={control}
          name="isFeatured"
          render={({ field }) => (
            <Switch label="Mark as featured resource" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </form>
    </Modal>
  );
}
