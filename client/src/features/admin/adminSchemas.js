import { z } from 'zod';

const RESOURCE_CATEGORY_VALUES = [
  'career_guidance',
  'resume_cv',
  'interview_prep',
  'job_search',
  'skills_development',
  'industry_insights',
  'career_stories',
];

export const resourceFormSchema = z.object({
  title: z.string().min(5, 'Title must be between 5 and 200 characters.').max(200, 'Title must be between 5 and 200 characters.'),
  category: z.enum(RESOURCE_CATEGORY_VALUES, { errorMap: () => ({ message: 'Select a category.' }) }),
  excerpt: z.string().min(10, 'Excerpt must be between 10 and 500 characters.').max(500, 'Excerpt must be between 10 and 500 characters.'),
  content: z.string().min(50, 'Content must be at least 50 characters.'),
  author: z.string().max(150, 'Author must be at most 150 characters.').optional().or(z.literal('')),
  tags: z.string().max(500, 'Tags must be at most 500 characters.').optional().or(z.literal('')),
  readingTimeMinutes: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || (Number(value) >= 1 && Number(value) <= 120), {
      message: 'Reading time must be between 1 and 120 minutes.',
    }),
  isFeatured: z.boolean().optional(),
  status: z.enum(['draft', 'published']),
});
