import { Router } from 'express';
import * as savedJobController from '../controllers/savedJob.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { jobIdParamValidator } from '../validators/savedJob.validator.js';

const router = Router();

router.use(authenticate, authorize('student'));

router.get('/', savedJobController.getMySavedJobs);
router.get('/ids', savedJobController.getMySavedJobIds);
router.post('/:jobId', jobIdParamValidator, validate, savedJobController.saveJob);
router.delete('/:jobId', jobIdParamValidator, validate, savedJobController.unsaveJob);

export default router;
