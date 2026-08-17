import { Router } from 'express';
import * as recruiterController from '../controllers/recruiter.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { updateRecruiterProfileValidator } from '../validators/recruiter.validator.js';
import { listRecruiterApplicationsValidator } from '../validators/application.validator.js';

const router = Router();

router.use(authenticate, authorize('recruiter'));

router.get('/me', recruiterController.getMe);
router.put('/me', updateRecruiterProfileValidator, validate, recruiterController.updateMe);
router.get('/me/dashboard', recruiterController.getDashboard);
router.get('/me/applications', listRecruiterApplicationsValidator, validate, recruiterController.getMyApplications);

export default router;
