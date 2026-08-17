import { param, query } from 'express-validator';

export const listNotificationsValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be between 1 and 50.'),
];

export const notificationIdParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('id must be a valid positive integer.'),
];
