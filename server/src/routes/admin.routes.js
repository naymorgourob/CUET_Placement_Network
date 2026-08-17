import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import * as resourceController from '../controllers/resource.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  recruiterIdParamValidator,
  userIdParamValidator,
  jobIdParamValidator,
  listRecruitersValidator,
  listUsersValidator,
  listJobsValidator,
  reportsValidator,
} from '../validators/admin.validator.js';
import {
  resourceIdParamValidator,
  listAdminResourcesValidator,
  createResourceValidator,
  updateResourceValidator,
} from '../validators/resource.validator.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.getDashboard);

router.get('/recruiters', listRecruitersValidator, validate, adminController.listRecruiters);
router.patch('/recruiters/:id/verify', recruiterIdParamValidator, validate, adminController.verifyRecruiter);
router.patch('/recruiters/:id/reject', recruiterIdParamValidator, validate, adminController.rejectRecruiter);

router.get('/users', listUsersValidator, validate, adminController.listUsers);
router.patch('/users/:userId/suspend', userIdParamValidator, validate, adminController.suspendUser);
router.patch('/users/:userId/reactivate', userIdParamValidator, validate, adminController.reactivateUser);

router.get('/jobs', listJobsValidator, validate, adminController.listJobs);
router.patch('/jobs/:jobId/remove', jobIdParamValidator, validate, adminController.removeJob);

router.get('/reports', reportsValidator, validate, adminController.getReports);
router.get('/reports/export', reportsValidator, validate, adminController.exportReports);

router.get('/resources', listAdminResourcesValidator, validate, resourceController.listAllResources);
router.get('/resources/:resourceId', resourceIdParamValidator, validate, resourceController.getResourceById);
router.post('/resources', createResourceValidator, validate, resourceController.createResource);
router.put('/resources/:resourceId', resourceIdParamValidator, updateResourceValidator, validate, resourceController.updateResource);
router.delete('/resources/:resourceId', resourceIdParamValidator, validate, resourceController.deleteResource);

export default router;
