import { body } from 'express-validator';

export const updateProfileValidator = [
  body('department')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must be at most 100 characters.'),

  body('cgpa')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 4 })
    .withMessage('CGPA must be a number between 0 and 4.'),

  body('batchYear')
    .optional({ nullable: true })
    .isInt({ min: 1990, max: 2100 })
    .withMessage('Batch year must be a valid year.'),

  body('phone')
    .optional({ nullable: true })
    .trim()
    .matches(/^[0-9+\-\s]{7,20}$/)
    .withMessage('Phone number must be a valid format.'),

  body('skills')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Skills must be at most 2000 characters.'),
];
