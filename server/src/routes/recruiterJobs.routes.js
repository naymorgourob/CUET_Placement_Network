import { Router } from 'express';
import * as jobController from '../controllers/job.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate, authorize('recruiter'));

router.get('/jobs', jobController.getMyJobs);

export default router;
