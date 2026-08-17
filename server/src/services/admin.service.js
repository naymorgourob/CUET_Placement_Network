import { Op } from 'sequelize';
import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { createNotification } from './notification.service.js';
import { NOTIFICATION_TYPES, RELATED_ENTITY_TYPES } from '../constants/notificationTypes.js';

export async function getDashboardStats() {
  const [
    totalStudents,
    totalRecruiters,
    totalCompanies,
    totalJobs,
    openJobs,
    closedJobs,
    totalApplications,
    pendingRecruiterVerifications,
  ] = await Promise.all([
    db.User.count({ where: { role: 'student' } }),
    db.User.count({ where: { role: 'recruiter' } }),
    db.Company.count(),
    db.Job.count(),
    db.Job.count({ where: { status: 'open' } }),
    db.Job.count({ where: { status: 'closed' } }),
    db.Application.count(),
    db.RecruiterProfile.count({ where: { isVerified: false } }),
  ]);

  return {
    totalStudents,
    totalRecruiters,
    totalCompanies,
    totalJobs,
    openJobs,
    closedJobs,
    totalApplications,
    pendingRecruiterVerifications,
  };
}

export async function listRecruiters(status) {
  const where = {};

  if (status === 'verified') {
    where.isVerified = true;
  } else if (status === 'unverified') {
    where.isVerified = false;
  }

  return db.RecruiterProfile.findAll({
    where,
    include: [
      { model: db.User, attributes: ['userId', 'fullName', 'email', 'isActive'] },
      { model: db.Company, attributes: ['companyId', 'name', 'industry'] },
    ],
    order: [['createdAt', 'DESC']],
  });
}

export async function verifyRecruiter(adminUserId, recruiterProfileId) {
  return db.sequelize.transaction(async (transaction) => {
    const recruiterProfile = await db.RecruiterProfile.findByPk(recruiterProfileId, { transaction });

    if (!recruiterProfile) {
      throw new AppError(404, 'Recruiter not found.');
    }

    if (recruiterProfile.isVerified) {
      throw new AppError(409, 'This recruiter is already verified.');
    }

    await recruiterProfile.update(
      {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: adminUserId,
      },
      { transaction }
    );

    await createNotification(
      {
        userId: recruiterProfile.userId,
        type: NOTIFICATION_TYPES.RECRUITER_VERIFIED,
        title: 'Recruiter account verified',
        message: 'Your recruiter account has been verified.',
        relatedEntityType: RELATED_ENTITY_TYPES.RECRUITER,
        relatedEntityId: recruiterProfile.recruiterProfileId,
      },
      { transaction }
    );

    return recruiterProfile;
  });
}

export async function rejectRecruiter(adminUserId, recruiterProfileId) {
  return db.sequelize.transaction(async (transaction) => {
    const recruiterProfile = await db.RecruiterProfile.findByPk(recruiterProfileId, { transaction });

    if (!recruiterProfile) {
      throw new AppError(404, 'Recruiter not found.');
    }

    await recruiterProfile.update(
      {
        isVerified: false,
        verifiedAt: null,
        verifiedBy: adminUserId,
      },
      { transaction }
    );

    await createNotification(
      {
        userId: recruiterProfile.userId,
        type: NOTIFICATION_TYPES.RECRUITER_REJECTED,
        title: 'Recruiter verification rejected',
        message: 'Your recruiter account verification was rejected.',
        relatedEntityType: RELATED_ENTITY_TYPES.RECRUITER,
        relatedEntityId: recruiterProfile.recruiterProfileId,
      },
      { transaction }
    );

    return recruiterProfile;
  });
}

export async function listUsers({ page = 1, limit = 10, role, isActive, search }) {
  const where = {};

  if (role) {
    where.role = role;
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true' || isActive === true;
  }

  if (search) {
    where[Op.or] = [
      { fullName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const { rows, count } = await db.User.findAndCountAll({
    where,
    attributes: ['userId', 'fullName', 'email', 'role', 'isActive', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: limitNumber,
    offset,
  });

  return {
    users: rows,
    pagination: {
      total: count,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
    },
  };
}

export async function suspendUser(userId) {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  await user.update({ isActive: false });

  return user;
}

export async function reactivateUser(userId) {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  if (!user.isActive) {
    await user.update({ isActive: true });
  }

  return user;
}

export async function listJobsForModeration({ page = 1, limit = 10, status, search }) {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const { rows, count } = await db.Job.findAndCountAll({
    where,
    include: [{ model: db.Company, attributes: ['companyId', 'name'] }],
    order: [['createdAt', 'DESC']],
    limit: limitNumber,
    offset,
  });

  return {
    jobs: rows,
    pagination: {
      total: count,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
    },
  };
}

export async function removeJob(jobId) {
  const job = await db.Job.findByPk(jobId);

  if (!job) {
    throw new AppError(404, 'Job not found.');
  }

  await job.update({ status: 'removed' });

  return job;
}

async function buildReportStats({ fromDate, toDate, department }) {
  const applicationWhere = {};

  if (fromDate || toDate) {
    applicationWhere.applied_at = {};
    if (fromDate) applicationWhere.applied_at[Op.gte] = new Date(fromDate);
    if (toDate) applicationWhere.applied_at[Op.lte] = new Date(toDate);
  }

  const studentProfileWhere = department ? { department } : undefined;

  const totalStudents = await db.User.count({ where: { role: 'student' } });

  const totalApplications = await db.Application.count({
    where: applicationWhere,
    include: studentProfileWhere
      ? [{ model: db.StudentProfile, attributes: [], where: studentProfileWhere, required: true }]
      : [],
  });

  const totalSelected = await db.Application.count({
    where: { ...applicationWhere, status: 'selected' },
    include: studentProfileWhere
      ? [{ model: db.StudentProfile, attributes: [], where: studentProfileWhere, required: true }]
      : [],
  });

  const byCompanyRaw = await db.Application.findAll({
    where: { ...applicationWhere, status: 'selected' },
    include: [
      {
        model: db.Job,
        attributes: [],
        required: true,
        include: [{ model: db.Company, attributes: ['name'], required: true }],
      },
      ...(studentProfileWhere
        ? [{ model: db.StudentProfile, attributes: [], where: studentProfileWhere, required: true }]
        : []),
    ],
    attributes: [
      [db.sequelize.col('Job.Company.name'), 'companyName'],
      [db.sequelize.fn('COUNT', db.sequelize.col('Application.application_id')), 'selected'],
    ],
    group: ['Job.Company.company_id'],
    raw: true,
  });

  const byCompany = byCompanyRaw.map((row) => ({
    companyName: row.companyName,
    selected: Number(row.selected),
  }));

  return { totalStudents, totalApplications, totalSelected, byCompany };
}

export async function getReports(filters) {
  return buildReportStats(filters);
}

export async function exportReports(filters) {
  return buildReportStats(filters);
}
