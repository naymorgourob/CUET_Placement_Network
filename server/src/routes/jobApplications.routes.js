import { Router } from 'express';
import * as applicationController from '../controllers/application.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { listApplicationsValidator, applyForJobValidator } from '../validators/application.validator.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = Router({ mergeParams: true });

router.post(
  '/applications',
  authenticate,
  authorize('student'),
  applyForJobValidator,
  validate,
  applicationController.applyForJob
);
router.get(
  '/applicants',
  authenticate,
  authorize('recruiter'),
  listApplicationsValidator,
  validate,
  applicationController.getApplicantsForJob
);

export default router;
