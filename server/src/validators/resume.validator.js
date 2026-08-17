import { param } from 'express-validator';

export const resumeIdParamValidator = [
  param('resumeId').isInt({ min: 1 }).withMessage('resumeId must be a valid positive integer.'),
];
