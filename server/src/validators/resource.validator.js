import { body, param, query } from 'express-validator';

const CATEGORIES = [
  'career_guidance',
  'resume_cv',
  'interview_prep',
  'job_search',
  'skills_development',
  'industry_insights',
  'career_stories',
];

export const resourceIdParamValidator = [
  param('resourceId').isInt({ min: 1 }).withMessage('resourceId must be a valid positive integer.'),
];

export const slugParamValidator = [
  param('slug').notEmpty().withMessage('slug is required.'),
];

export const listPublicResourcesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be between 1 and 50.'),
  query('category').optional().isIn(CATEGORIES).withMessage(`category must be one of: ${CATEGORIES.join(', ')}.`),
];

export const listAdminResourcesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
  query('category').optional().isIn(CATEGORIES).withMessage(`category must be one of: ${CATEGORIES.join(', ')}.`),
  query('status').optional().isIn(['draft', 'published']).withMessage('status must be "draft" or "published".'),
];

export const createResourceValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required.')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters.'),

  body('category').isIn(CATEGORIES).withMessage(`category must be one of: ${CATEGORIES.join(', ')}.`),

  body('excerpt')
    .notEmpty()
    .withMessage('Excerpt is required.')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Excerpt must be between 10 and 500 characters.'),

  body('content')
    .notEmpty()
    .withMessage('Content is required.')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters.'),

  body('coverImagePath').optional({ nullable: true }).trim().isLength({ max: 255 }),

  body('author').optional({ nullable: true }).trim().isLength({ max: 150 }),

  body('tags').optional({ nullable: true }).trim().isLength({ max: 500 }),

  body('readingTimeMinutes').optional({ nullable: true }).isInt({ min: 1, max: 120 }),

  body('isFeatured').optional().isBoolean(),

  body('status').optional().isIn(['draft', 'published']).withMessage('status must be "draft" or "published".'),
];

export const updateResourceValidator = [
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('category').optional().isIn(CATEGORIES).withMessage(`category must be one of: ${CATEGORIES.join(', ')}.`),
  body('excerpt').optional().trim().isLength({ min: 10, max: 500 }),
  body('content').optional().trim().isLength({ min: 50 }),
  body('coverImagePath').optional({ nullable: true }).trim().isLength({ max: 255 }),
  body('author').optional({ nullable: true }).trim().isLength({ max: 150 }),
  body('tags').optional({ nullable: true }).trim().isLength({ max: 500 }),
  body('readingTimeMinutes').optional({ nullable: true }).isInt({ min: 1, max: 120 }),
  body('isFeatured').optional().isBoolean(),
  body('status').optional().isIn(['draft', 'published']).withMessage('status must be "draft" or "published".'),
];
