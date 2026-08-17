import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { listNotificationsValidator, notificationIdParamValidator } from '../validators/notification.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', listNotificationsValidator, validate, notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationIdParamValidator, validate, notificationController.markAsRead);

export default router;
