import { z } from 'zod';

export const recruiterProfileSchema = z.object({
  designation: z.string().max(100, 'Designation must be at most 100 characters.').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^[0-9+\-\s]{7,20}$/, 'Enter a valid phone number.')
    .optional()
    .or(z.literal('')),
});

export const companyProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Company name must be at least 2 characters.')
    .max(150, 'Company name must be at most 150 characters.'),
  industry: z.string().max(100, 'Industry must be at most 100 characters.').optional().or(z.literal('')),
  website: z
    .string()
    .url('Website must be a valid URL.')
    .regex(/^https?:\/\//, 'Website must start with http:// or https://.')
    .optional()
    .or(z.literal('')),
  description: z.string().max(2000, 'Description must be at most 2000 characters.').optional().or(z.literal('')),
});

const JOB_TYPES = ['full-time', 'internship', 'part-time'];

export const jobFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Job title must be between 3 and 150 characters.')
    .max(150, 'Job title must be between 3 and 150 characters.'),
  description: z.string().min(10, 'Job description must be at least 10 characters.'),
  requirements: z.string().max(5000, 'Requirements must be at most 5000 characters.').optional().or(z.literal('')),
  location: z.string().max(150, 'Location must be at most 150 characters.').optional().or(z.literal('')),
  jobType: z.enum(JOB_TYPES).optional().or(z.literal('')),
  deadline: z.string().optional().or(z.literal('')),
});
