import { Router } from 'express';
import * as companyController from '../controllers/company.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { updateCompanyValidator } from '../validators/company.validator.js';
import { uploadCompanyLogo } from '../middlewares/upload.middleware.js';

const router = Router();

router.use(authenticate, authorize('recruiter'));

router.get('/me', companyController.getMe);
router.put('/me', updateCompanyValidator, validate, companyController.updateMe);
router.put('/me/logo', uploadCompanyLogo.single('logo'), companyController.updateLogo);

export default router;
