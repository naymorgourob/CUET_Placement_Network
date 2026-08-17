import { param } from 'express-validator';

export const jobIdParamValidator = [
  param('jobId').isInt({ min: 1 }).withMessage('jobId must be a valid positive integer.'),
];
