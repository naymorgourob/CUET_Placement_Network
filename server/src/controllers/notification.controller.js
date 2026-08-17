import * as notificationService from '../services/notification.service.js';
import { successResponse } from '../utils/apiResponse.js';

export async function getMyNotifications(req, res, next) {
  try {
    const result = await notificationService.getUserNotifications(req.user.userId, req.query);
    return successResponse(res, 200, 'Notifications retrieved.', result);
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const result = await notificationService.getUnreadCount(req.user.userId);
    return successResponse(res, 200, 'Unread count retrieved.', result);
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const notification = await notificationService.markAsRead(req.user.userId, req.params.id);
    return successResponse(res, 200, 'Notification marked as read.', { isRead: notification.isRead });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const result = await notificationService.markAllAsRead(req.user.userId);
    return successResponse(res, 200, 'All notifications marked as read.', result);
  } catch (error) {
    next(error);
  }
}
