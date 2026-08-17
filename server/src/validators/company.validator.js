import { body, param, query } from 'express-validator';

export const companyIdParamValidator = [
  param('companyId').isInt({ min: 1 }).withMessage('companyId must be a valid positive integer.'),
];

export const listCompaniesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
];

export const updateCompanyValidator = [
  body('name')
    .notEmpty()
    .withMessage('Company name is required.')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Company name must be between 2 and 150 characters.'),

  body('industry')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry must be at most 100 characters.'),

  body('website')
    .optional({ nullable: true })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Website must be a valid URL starting with http:// or https://.'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters.'),
];
