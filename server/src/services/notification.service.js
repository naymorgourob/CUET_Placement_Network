import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';

export async function createNotification(
  { userId, type, title, message, relatedEntityType = null, relatedEntityId = null },
  { transaction } = {}
) {
  return db.Notification.create(
    { userId, type, title, message, relatedEntityType, relatedEntityId },
    { transaction }
  );
}

export async function createNotifications(notifications, { transaction } = {}) {
  if (!notifications.length) {
    return [];
  }

  return db.Notification.bulkCreate(
    notifications.map((notification) => ({
      relatedEntityType: null,
      relatedEntityId: null,
      ...notification,
    })),
    { transaction }
  );
}

export async function getAdminUserIds({ transaction } = {}) {
  const admins = await db.User.findAll({
    where: { role: 'admin', isActive: true },
    attributes: ['userId'],
    transaction,
  });

  return admins.map((admin) => admin.userId);
}

export async function getUserNotifications(userId, { page = 1, limit = 20 } = {}) {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const { rows, count } = await db.Notification.findAndCountAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit: limitNumber,
    offset,
  });

  return {
    notifications: rows,
    pagination: {
      total: count,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
    },
  };
}

export async function getUnreadCount(userId) {
  const count = await db.Notification.count({ where: { userId, isRead: false } });
  return { unreadCount: count };
}

export async function markAsRead(userId, notificationId) {
  const notification = await db.Notification.findByPk(notificationId);

  if (!notification) {
    throw new AppError(404, 'Notification not found.');
  }

  if (notification.userId !== userId) {
    throw new AppError(403, 'You do not have permission to modify this notification.');
  }

  if (!notification.isRead) {
    await notification.update({ isRead: true });
  }

  return notification;
}

export async function markAllAsRead(userId) {
  await db.Notification.update({ isRead: true }, { where: { userId, isRead: false } });
  return getUnreadCount(userId);
}
