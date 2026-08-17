import { body, param, query } from 'express-validator';

const JOB_TYPES = ['full-time', 'internship', 'part-time'];

export const jobIdParamValidator = [
  param('jobId').isInt({ min: 1 }).withMessage('jobId must be a valid positive integer.'),
];

export const createJobValidator = [
  body('title')
    .notEmpty()
    .withMessage('Job title is required.')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Job title must be between 3 and 150 characters.'),

  body('description')
    .notEmpty()
    .withMessage('Job description is required.')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Job description must be at least 10 characters.'),

  body('requirements')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Requirements must be at most 5000 characters.'),

  body('location')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Location must be at most 150 characters.'),

  body('jobType')
    .optional()
    .isIn(JOB_TYPES)
    .withMessage(`Job type must be one of: ${JOB_TYPES.join(', ')}.`),

  body('deadline')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Deadline must be a valid date (YYYY-MM-DD).')
    .toDate(),
];

export const updateJobValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Job title must be between 3 and 150 characters.'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Job description must be at least 10 characters.'),

  body('requirements')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Requirements must be at most 5000 characters.'),

  body('location')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Location must be at most 150 characters.'),

  body('jobType')
    .optional()
    .isIn(JOB_TYPES)
    .withMessage(`Job type must be one of: ${JOB_TYPES.join(', ')}.`),

  body('deadline')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Deadline must be a valid date (YYYY-MM-DD).')
    .toDate(),
];

export const listJobsValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
  query('companyId').optional().isInt({ min: 1 }).withMessage('companyId must be a valid positive integer.'),
  query('jobType').optional().isIn(JOB_TYPES).withMessage(`jobType must be one of: ${JOB_TYPES.join(', ')}.`),
  query('status')
    .optional()
    .isIn(['open', 'closed', 'removed'])
    .withMessage('status must be one of: open, closed, removed.'),
  query('sort').optional().isIn(['newest', 'oldest']).withMessage('sort must be "newest" or "oldest".'),
];
