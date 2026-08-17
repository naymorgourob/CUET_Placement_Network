import { Router } from 'express';
import * as applicationController from '../controllers/application.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { updateStatusValidator, applicationIdParamValidator } from '../validators/application.validator.js';

const router = Router();

router.use(authenticate);

router.get('/:applicationId', applicationController.getApplicationDetails);
router.patch(
  '/:applicationId/status',
  authorize('recruiter'),
  updateStatusValidator,
  validate,
  applicationController.updateApplicationStatus
);
router.post(
  '/:applicationId/match',
  authorize('recruiter'),
  applicationIdParamValidator,
  validate,
  applicationController.generateApplicantMatch
);
router.get(
  '/:applicationId/match',
  authorize('recruiter'),
  applicationIdParamValidator,
  validate,
  applicationController.getApplicantMatch
);

export default router;
