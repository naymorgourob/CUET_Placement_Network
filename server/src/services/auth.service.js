import bcrypt from 'bcrypt';
import db from '../models/index.js';
import { generateToken } from '../utils/generateToken.js';
import { AppError } from '../utils/AppError.js';
import { createNotifications, getAdminUserIds } from './notification.service.js';
import { NOTIFICATION_TYPES, RELATED_ENTITY_TYPES } from '../constants/notificationTypes.js';

const SALT_ROUNDS = 10;

async function createUserWithRole({ fullName, email, password, role }, createProfile) {
  return db.sequelize.transaction(async (transaction) => {
    const existingUser = await db.User.findOne({ where: { email }, transaction });
    if (existingUser) {
      throw new AppError(409, 'Email is already registered.');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await db.User.create(
      { fullName, email, passwordHash, role },
      { transaction }
    );

    await createProfile(user, transaction);

    return { userId: user.userId, role: user.role };
  });
}

export async function registerStudent({ fullName, email, password }) {
  return createUserWithRole({ fullName, email, password, role: 'student' }, (user, transaction) =>
    db.StudentProfile.create({ userId: user.userId }, { transaction })
  );
}

export async function registerRecruiter({ fullName, email, password }) {
  return createUserWithRole({ fullName, email, password, role: 'recruiter' }, async (user, transaction) => {
    await db.RecruiterProfile.create({ userId: user.userId, isVerified: false }, { transaction });

    const adminUserIds = await getAdminUserIds({ transaction });

    await createNotifications(
      adminUserIds.map((adminUserId) => ({
        userId: adminUserId,
        type: NOTIFICATION_TYPES.NEW_RECRUITER_REGISTRATION,
        title: 'New recruiter registration',
        message: `${user.fullName} registered as a recruiter and is awaiting verification.`,
        relatedEntityType: RELATED_ENTITY_TYPES.RECRUITER,
        relatedEntityId: user.userId,
      })),
      { transaction }
    );
  });
}

export async function login({ email, password }) {
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    throw new AppError(401, 'This account has been suspended.');
  }

  const token = generateToken({ userId: user.userId, role: user.role });

  return { token, userId: user.userId, role: user.role };
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await db.User.findByPk(userId);
  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isCurrentPasswordValid) {
    throw new AppError(403, 'Current password is incorrect.');
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.update({ passwordHash });
}

export async function getCurrentUser(user) {
  const summary = {
    userId: user.userId,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };

  if (user.role === 'student') {
    const profile = await db.StudentProfile.findOne({ where: { userId: user.userId } });
    summary.profile = profile;
  } else if (user.role === 'recruiter') {
    const profile = await db.RecruiterProfile.findOne({ where: { userId: user.userId } });
    summary.profile = profile;
  }

  return summary;
}
