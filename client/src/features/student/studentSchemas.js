import { z } from 'zod';

export const studentProfileSchema = z.object({
  department: z.string().max(100, 'Department must be at most 100 characters.').optional().or(z.literal('')),
  batchYear: z
    .union([z.coerce.number().int().min(1990).max(2100), z.literal('')])
    .optional(),
  cgpa: z.union([z.coerce.number().min(0, 'CGPA must be at least 0.').max(4, 'CGPA must be at most 4.'), z.literal('')]).optional(),
  phone: z
    .string()
    .regex(/^[0-9+\-\s]{7,20}$/, 'Enter a valid phone number.')
    .optional()
    .or(z.literal('')),
  skills: z.string().max(2000, 'Skills must be at most 2000 characters.').optional().or(z.literal('')),
});
