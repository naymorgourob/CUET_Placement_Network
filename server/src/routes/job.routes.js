import { Router } from 'express';
import * as jobController from '../controllers/job.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createJobValidator,
  updateJobValidator,
  listJobsValidator,
  jobIdParamValidator,
} from '../validators/job.validator.js';

const router = Router();

router.get('/', listJobsValidator, validate, jobController.listJobs);
router.get('/:jobId', jobController.getJobDetails);

router.post('/', authenticate, authorize('recruiter'), createJobValidator, validate, jobController.createJob);
router.put('/:jobId', authenticate, authorize('recruiter'), updateJobValidator, validate, jobController.updateJob);
router.patch('/:jobId/close', authenticate, authorize('recruiter'), jobController.closeJob);
router.delete('/:jobId', authenticate, authorize('recruiter'), jobController.deleteJob);

router.post(
  '/:jobId/match',
  authenticate,
  authorize('student'),
  jobIdParamValidator,
  validate,
  jobController.generateJobMatch
);
router.get(
  '/:jobId/match',
  authenticate,
  authorize('student'),
  jobIdParamValidator,
  validate,
  jobController.getJobMatch
);

export default router;
