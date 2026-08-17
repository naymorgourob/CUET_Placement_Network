import { Router } from 'express';
import * as applicationController from '../controllers/application.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { listApplicationsValidator } from '../validators/application.validator.js';

const router = Router();

router.use(authenticate, authorize('student'));

router.get('/applications', listApplicationsValidator, validate, applicationController.getMyApplications);

export default router;
