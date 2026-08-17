import { Op } from 'sequelize';
import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { createNotification } from './notification.service.js';
import { NOTIFICATION_TYPES, RELATED_ENTITY_TYPES, APPLICATION_STATUS_NOTIFICATION_TYPE } from '../constants/notificationTypes.js';

async function getStudentProfileByUserId(userId) {
  const profile = await db.StudentProfile.findOne({ where: { userId } });

  if (!profile) {
    throw new AppError(404, 'Student profile not found.');
  }

  return profile;
}

async function getJobOwnedByRecruiter(jobId, userId) {
  const job = await db.Job.findByPk(jobId);

  if (!job) {
    throw new AppError(404, 'Job not found.');
  }

  if (job.postedBy !== userId) {
    throw new AppError(403, 'You do not have permission to access this job.');
  }

  return job;
}

export async function applyForJob(userId, jobId, coverLetter) {
  return db.sequelize.transaction(async (transaction) => {
    const profile = await db.StudentProfile.findOne({ where: { userId }, transaction });

    if (!profile) {
      throw new AppError(404, 'Student profile not found.');
    }

    if (!profile.currentResumeId) {
      throw new AppError(400, 'You must have a current resume on file before applying.');
    }

    const job = await db.Job.findByPk(jobId, {
      include: [{ model: db.Company, attributes: ['name'] }],
      transaction,
    });

    if (!job) {
      throw new AppError(404, 'Job not found.');
    }

    if (job.status !== 'open') {
      throw new AppError(403, 'This job is not open for applications.');
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      throw new AppError(403, 'The application deadline for this job has passed.');
    }

    const existingApplication = await db.Application.findOne({
      where: { jobId: job.jobId, studentProfileId: profile.studentProfileId },
      transaction,
    });

    if (existingApplication) {
      throw new AppError(409, 'You have already applied to this job.');
    }

    const application = await db.Application.create(
      {
        jobId: job.jobId,
        studentProfileId: profile.studentProfileId,
        resumeId: profile.currentResumeId,
        coverLetter: coverLetter || null,
        status: 'applied',
      },
      { transaction }
    );

    const student = await db.User.findByPk(userId, { attributes: ['fullName'], transaction });
    const companyName = job.Company?.name ?? 'the company';

    await createNotification(
      {
        userId,
        type: NOTIFICATION_TYPES.APPLICATION_SUBMITTED,
        title: 'Application submitted',
        message: `Your application for ${job.title} at ${companyName} was submitted successfully.`,
        relatedEntityType: RELATED_ENTITY_TYPES.APPLICATION,
        relatedEntityId: application.applicationId,
      },
      { transaction }
    );

    await createNotification(
      {
        userId: job.postedBy,
        type: NOTIFICATION_TYPES.NEW_APPLICATION,
        title: 'New application',
        message: `${student?.fullName ?? 'A student'} applied for ${job.title}.`,
        relatedEntityType: RELATED_ENTITY_TYPES.APPLICATION,
        relatedEntityId: application.applicationId,
      },
      { transaction }
    );

    return application;
  });
}

export async function getMyApplications(userId, { page = 1, limit = 10, status }) {
  const profile = await getStudentProfileByUserId(userId);

  const where = { studentProfileId: profile.studentProfileId };
  if (status) {
    where.status = status;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const { rows, count } = await db.Application.findAndCountAll({
    where,
    include: [
      {
        model: db.Job,
        attributes: ['jobId', 'title', 'jobType', 'status', 'location'],
        include: [{ model: db.Company, attributes: ['companyId', 'name', 'industry'] }],
      },
    ],
    order: [['applied_at', 'DESC']],
    limit: limitNumber,
    offset,
  });

  return {
    applications: rows,
    pagination: {
      total: count,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
    },
  };
}

export async function getApplicationsForRecruiter(
  userId,
  { page = 1, limit = 10, status, jobId, search, sort = 'recent' }
) {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (jobId) {
    await getJobOwnedByRecruiter(jobId, userId);
    where.jobId = jobId;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  if (search) {
    const matchingJobIds = (
      await db.Job.findAll({
        where: { postedBy: userId, title: { [Op.like]: `%${search}%` } },
        attributes: ['jobId'],
      })
    ).map((job) => job.jobId);

    const matchingStudentProfileIds = (
      await db.StudentProfile.findAll({
        attributes: ['studentProfileId'],
        include: [
          {
            model: db.User,
            attributes: [],
            required: true,
            where: { [Op.or]: [{ fullName: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }] },
          },
        ],
      })
    ).map((profile) => profile.studentProfileId);

    where[Op.or] = [{ jobId: matchingJobIds }, { studentProfileId: matchingStudentProfileIds }];
  }

  const { rows, count } = await db.Application.findAndCountAll({
    where,
    include: [
      {
        model: db.Job,
        attributes: ['jobId', 'title', 'jobType', 'status', 'location'],
        required: true,
        where: { postedBy: userId },
        include: [{ model: db.Company, attributes: ['companyId', 'name', 'industry', 'logoPath'] }],
      },
      {
        model: db.StudentProfile,
        attributes: ['studentProfileId', 'department', 'batchYear', 'cgpa'],
        required: true,
        include: [{ model: db.User, attributes: ['userId', 'fullName', 'email'], required: true }],
      },
      {
        model: db.Resume,
        attributes: ['resumeId', 'filePath', 'originalFileName'],
      },
    ],
    order: [['applied_at', sort === 'oldest' ? 'ASC' : 'DESC']],
    limit: limitNumber,
    offset,
    distinct: true,
  });

  return {
    applications: rows,
    pagination: {
      total: count,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
    },
  };
}

export async function getApplicantsForJob(userId, jobId, { page = 1, limit = 10, status }) {
  await getJobOwnedByRecruiter(jobId, userId);

  const where = { jobId };
  if (status) {
    where.status = status;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const { rows, count } = await db.Application.findAndCountAll({
    where,
    include: [
      {
        model: db.StudentProfile,
        attributes: ['studentProfileId', 'department', 'batchYear', 'cgpa'],
        include: [{ model: db.User, attributes: ['userId', 'fullName', 'email'] }],
      },
      {
        model: db.Resume,
        attributes: ['resumeId', 'filePath', 'originalFileName'],
      },
    ],
    order: [['applied_at', 'DESC']],
    limit: limitNumber,
    offset,
  });

  return {
    applicants: rows,
    pagination: {
      total: count,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(count / limitNumber),
    },
  };
}

export async function updateApplicationStatus(userId, applicationId, newStatus) {
  return db.sequelize.transaction(async (transaction) => {
    const application = await db.Application.findByPk(applicationId, { transaction });

    if (!application) {
      throw new AppError(404, 'Application not found.');
    }

    const job = await db.Job.findByPk(application.jobId, {
      include: [{ model: db.Company, attributes: ['name'] }],
      transaction,
    });

    if (!job || job.postedBy !== userId) {
      throw new AppError(403, 'You do not have permission to update this application.');
    }

    if (application.status === 'rejected' || application.status === 'selected') {
      throw new AppError(409, 'This application is already in a terminal state and cannot be updated.');
    }

    const previousStatus = application.status;

    await application.update({ status: newStatus }, { transaction });

    if (newStatus !== previousStatus) {
      const notificationType = APPLICATION_STATUS_NOTIFICATION_TYPE[newStatus];

      if (notificationType) {
        const companyName = job.Company?.name ?? 'the company';
        const studentUserId = (await db.StudentProfile.findByPk(application.studentProfileId, {
          attributes: ['userId'],
          transaction,
        }))?.userId;

        if (studentUserId) {
          const message =
            newStatus === 'selected'
              ? `Congratulations! Your application for ${job.title} at ${companyName} has been selected.`
              : `Your application for ${job.title} at ${companyName} has been ${newStatus.replace('_', ' ')}.`;

          await createNotification(
            {
              userId: studentUserId,
              type: notificationType,
              title: `Application ${newStatus.replace('_', ' ')}`,
              message,
              relatedEntityType: RELATED_ENTITY_TYPES.APPLICATION,
              relatedEntityId: application.applicationId,
            },
            { transaction }
          );
        }
      }
    }

    return application;
  });
}

export async function getRecruiterApplicationStats(userId) {
  const rows = await db.Application.findAll({
    attributes: ['status', [db.sequelize.fn('COUNT', db.sequelize.col('Application.application_id')), 'count']],
    include: [{ model: db.Job, attributes: [], where: { postedBy: userId } }],
    group: ['status'],
    raw: true,
  });

  const countByStatus = Object.fromEntries(rows.map((row) => [row.status, Number(row.count)]));

  const totalApplications = Object.values(countByStatus).reduce((sum, count) => sum + count, 0);

  return {
    totalApplications,
    applied: countByStatus.applied ?? 0,
    underReview: countByStatus.under_review ?? 0,
    shortlisted: countByStatus.shortlisted ?? 0,
    rejected: countByStatus.rejected ?? 0,
    selected: countByStatus.selected ?? 0,
  };
}

export async function getRecentApplicationsForRecruiter(userId, limit = 8) {
  const applications = await db.Application.findAll({
    include: [
      {
        model: db.Job,
        attributes: ['jobId', 'title'],
        where: { postedBy: userId },
      },
      {
        model: db.StudentProfile,
        attributes: ['studentProfileId'],
        include: [{ model: db.User, attributes: ['userId', 'fullName'] }],
      },
    ],
    order: [['applied_at', 'DESC']],
    limit,
  });

  return applications;
}

export async function getApplicationDetails(user, applicationId) {
  const application = await db.Application.findByPk(applicationId, {
    include: [
      {
        model: db.Job,
        attributes: ['jobId', 'title', 'jobType', 'status', 'location', 'postedBy'],
        include: [{ model: db.Company, attributes: ['companyId', 'name', 'industry', 'logoPath'] }],
      },
      {
        model: db.StudentProfile,
        attributes: ['studentProfileId', 'department', 'batchYear', 'cgpa', 'phone', 'skills'],
        include: [{ model: db.User, attributes: ['userId', 'fullName', 'email'] }],
      },
      {
        model: db.Resume,
        attributes: ['resumeId', 'filePath', 'originalFileName', 'uploadedAt'],
      },
    ],
  });

  if (!application) {
    throw new AppError(404, 'Application not found.');
  }

  if (user.role === 'student') {
    const profile = await getStudentProfileByUserId(user.userId);
    if (application.studentProfileId !== profile.studentProfileId) {
      throw new AppError(403, 'You do not have permission to access this application.');
    }
  } else if (user.role === 'recruiter') {
    if (application.Job.postedBy !== user.userId) {
      throw new AppError(403, 'You do not have permission to access this application.');
    }
  } else {
    throw new AppError(403, 'You do not have permission to access this application.');
  }

  return application;
}
