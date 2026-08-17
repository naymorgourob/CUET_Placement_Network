import { param, query } from 'express-validator';

export const recruiterIdParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('id must be a valid positive integer.'),
];

export const userIdParamValidator = [
  param('userId').isInt({ min: 1 }).withMessage('userId must be a valid positive integer.'),
];

export const jobIdParamValidator = [
  param('jobId').isInt({ min: 1 }).withMessage('jobId must be a valid positive integer.'),
];

export const listRecruitersValidator = [
  query('status').optional().isIn(['verified', 'unverified']).withMessage('status must be "verified" or "unverified".'),
];

export const listUsersValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
  query('role').optional().isIn(['student', 'recruiter', 'admin']).withMessage('role must be a valid role.'),
  query('isActive').optional().isBoolean().withMessage('isActive must be true or false.'),
  query('search').optional().trim().isLength({ max: 150 }).withMessage('search must be at most 150 characters.'),
];

export const listJobsValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
  query('status')
    .optional()
    .isIn(['open', 'closed', 'removed'])
    .withMessage('status must be one of: open, closed, removed.'),
  query('search').optional().trim().isLength({ max: 150 }).withMessage('search must be at most 150 characters.'),
];

export const reportsValidator = [
  query('fromDate').optional().isISO8601().withMessage('fromDate must be a valid date.'),
  query('toDate').optional().isISO8601().withMessage('toDate must be a valid date.'),
];
