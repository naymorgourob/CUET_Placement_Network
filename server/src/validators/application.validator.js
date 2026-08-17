import { body, param, query } from 'express-validator';

export const applicationIdParamValidator = [
  param('applicationId').isInt({ min: 1 }).withMessage('applicationId must be a valid positive integer.'),
];

export const applyForJobValidator = [
  body('coverLetter')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .isLength({ max: 3000 })
    .withMessage('coverLetter must be at most 3000 characters.'),
];

export const updateStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('status is required.')
    .isIn(['under_review', 'shortlisted', 'rejected', 'selected'])
    .withMessage('status must be one of: under_review, shortlisted, rejected, selected.'),
];

export const listApplicationsValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
  query('status')
    .optional()
    .isIn(['applied', 'under_review', 'shortlisted', 'rejected', 'selected'])
    .withMessage('status must be a valid application status.'),
];

export const listRecruiterApplicationsValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
  query('status')
    .optional()
    .isIn(['applied', 'under_review', 'shortlisted', 'rejected', 'selected'])
    .withMessage('status must be a valid application status.'),
  query('jobId').optional().isInt({ min: 1 }).withMessage('jobId must be a valid positive integer.'),
  query('search').optional().isString().trim().isLength({ max: 150 }).withMessage('search must be at most 150 characters.'),
  query('sort').optional().isIn(['recent', 'oldest']).withMessage('sort must be "recent" or "oldest".'),
];
