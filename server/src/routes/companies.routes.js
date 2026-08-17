import { Router } from 'express';
import * as companyController from '../controllers/company.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { listCompaniesValidator, companyIdParamValidator } from '../validators/company.validator.js';

const router = Router();

router.get('/', listCompaniesValidator, validate, companyController.listCompanies);
router.get('/:companyId', companyIdParamValidator, validate, companyController.getCompanyById);

export default router;
