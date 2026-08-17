import { Router } from 'express';
import * as resumeController from '../controllers/resume.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { uploadResume } from '../middlewares/upload.middleware.js';
import { resumeIdParamValidator } from '../validators/resume.validator.js';

const router = Router();

router.use(authenticate, authorize('student'));

router.post('/', uploadResume.single('file'), resumeController.upload);
router.get('/', resumeController.getMyResumes);
router.get('/:resumeId', resumeIdParamValidator, validate, resumeController.getResumeDetails);
router.patch('/:resumeId/set-current', resumeIdParamValidator, validate, resumeController.setCurrentResume);
router.delete('/:resumeId', resumeIdParamValidator, validate, resumeController.deleteResume);
router.post('/:resumeId/analyze', resumeIdParamValidator, validate, resumeController.analyzeResume);
router.get('/:resumeId/analysis', resumeIdParamValidator, validate, resumeController.getResumeAnalysis);
router.post(
  '/:resumeId/improvement-suggestions',
  resumeIdParamValidator,
  validate,
  resumeController.generateImprovementSuggestions
);
router.get(
  '/:resumeId/improvement-suggestions',
  resumeIdParamValidator,
  validate,
  resumeController.getImprovementSuggestions
);

export default router;
