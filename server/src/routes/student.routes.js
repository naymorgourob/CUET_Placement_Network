import { Router } from 'express';
import * as studentController from '../controllers/student.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { updateProfileValidator } from '../validators/student.validator.js';

const router = Router();

router.use(authenticate, authorize('student'));

router.get('/me', studentController.getMe);
router.put('/me', updateProfileValidator, validate, studentController.updateMe);
router.get('/me/dashboard', studentController.getDashboard);

export default router;
