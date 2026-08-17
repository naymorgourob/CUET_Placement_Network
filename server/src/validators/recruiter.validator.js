import { body } from 'express-validator';

export const updateRecruiterProfileValidator = [
  body('designation')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Designation must be at most 100 characters.'),

  body('phone')
    .optional({ nullable: true })
    .trim()
    .matches(/^[0-9+\-\s]{7,20}$/)
    .withMessage('Phone number must be a valid format.'),
];
