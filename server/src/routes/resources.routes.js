import { Router } from 'express';
import * as resourceController from '../controllers/resource.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { listPublicResourcesValidator, slugParamValidator } from '../validators/resource.validator.js';

const router = Router();

router.get('/', listPublicResourcesValidator, validate, resourceController.listPublishedResources);
router.get('/featured', resourceController.getFeaturedResource);
router.get('/:slug', slugParamValidator, validate, resourceController.getResourceBySlug);

export default router;
