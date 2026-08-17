import { Op } from 'sequelize';
import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';

async function getVerifiedRecruiterProfile(userId) {
  const recruiterProfile = await db.RecruiterProfile.findOne({ where: { userId } });

  if (!recruiterProfile) {
    throw new AppError(404, 'Recruiter profile not found.');
  }

  if (!recruiterProfile.isVerified) {
    throw new AppError(403, 'Your recruiter account has not been verified yet.');
  }

  if (!recruiterProfile.companyId) {
    throw new AppError(400, 'You must create a company profile before posting a job.');
  }

  return recruiterProfile;
}

async function getJobOwnedByRecruiter(jobId, userId) {
  const job = await db.Job.findByPk(jobId);

  if (!job) {
    throw new AppError(404, 'Job not found.');
  }

  if (job.postedBy !== userId) {
    throw new AppError(403, 'You do not have permission to modify this job.');
  }

  return job;
}

export async function createJob(userId, jobData) {
  const recruiterProfile = await getVerifiedRecruiterProfile(userId);

  const { title, description, requirements, location, jobType, deadline } = jobData;

  const job = await db.Job.create({
    companyId: recruiterProfile.companyId,
    postedBy: userId,
    title,
    description,
    requirements,
    location,
    jobType,
    deadline,
  });

  return job;
}

export async function updateJob(userId, jobId, updates) {
  const job = await getJobOwnedByRecruiter(jobId, userId);

  const { title, description, requirements, location, jobType, deadline } = updates;

  await job.update({
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(requirements !== undefined && { requirements }),
    ...(location !== undefined && { location }),
    ...(jobType !== undefined && { jobType }),
    ...(deadline !== undefined && { deadline }),
  });

  return job;
}

export async function closeJob(userId, jobId) {
  const job = await getJobOwnedByRecruiter(jobId, userId);

  await job.update({ status: 'closed' });

  return job;
}

export async function deleteJob(userId, jobId) {
  return db.sequelize.transaction(async (transaction) => {
    const job = await db.Job.findByPk(jobId, { transaction });

    if (!job) {
      throw new AppError(404, 'Job not found.');
    }

    if (job.postedBy !== userId) {
      throw new AppError(403, 'You do not have permission to delete this job.');
    }

    if (job.status === 'removed') {
      throw new AppError(409, 'This job has already been deleted.');
    }

    const applicationCount = await db.Application.count({ where: { jobId: job.jobId }, transaction });

    if (applicationCount > 0) {
      await job.update({ status: 'removed' }, { transaction });
      return { mode: 'soft', job };
    }

    await job.destroy({ transaction });
    return { mode: 'hard', jobId: job.jobId };
  });
}

export async function getJobDetails(jobId) {
  const job = await db.Job.findByPk(jobId, {
    include: [
      { model: db.Company, attributes: ['companyId', 'name', 'industry', 'website', 'logoPath', 'description'] },
    ],
  });

  if (!job) {
    throw new AppError(404, 'Job not found.');
  }

  return job;
}

export async function listJobs(query) {
  const {
    search,
    location,
    jobType,
    status = 'open',
    company,
    companyId,
    sort = 'newest',
    page = 1,
    limit = 10,
  } = query;

  const where = { status };

  if (location) {
    where.location = { [Op.like]: `%${location}%` };
  }

  if (jobType) {
    where.jobType = jobType;
  }

  if (companyId) {
    where.companyId = companyId;
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  const companyWhere = company ? { name: { [Op.like]: `%${company}%` } } : undefined;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const { rows, count } = await db.Job.findAndCountAll({
    where,
    include: [
      {
        model: db.Company,
        attributes: ['companyId', 'name', 'industry', 'logoPath'],
        where: companyWhere,
      },
    ],
    order: [['createdAt', sort === 'oldest' ? 'ASC' : 'DESC']],
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

export async function getMyJobs(userId) {
  const jobs = await db.Job.findAll({
    where: { postedBy: userId },
    order: [['createdAt', 'DESC']],
  });

  const jobIds = jobs.map((job) => job.jobId);

  const counts = jobIds.length
    ? await db.Application.findAll({
        where: { jobId: jobIds },
        attributes: ['jobId', [db.sequelize.fn('COUNT', db.sequelize.col('application_id')), 'applicationCount']],
        group: ['jobId'],
        raw: true,
      })
    : [];

  const countByJobId = new Map(counts.map((row) => [row.jobId, Number(row.applicationCount)]));

  return jobs.map((job) => {
    const plainJob = job.toJSON();
    return { ...plainJob, applicationCount: countByJobId.get(job.jobId) ?? 0 };
  });
}

export async function getRecruiterJobStats(userId) {
  const totalJobs = await db.Job.count({ where: { postedBy: userId } });
  const activeJobs = await db.Job.count({ where: { postedBy: userId, status: 'open' } });
  const closedJobs = await db.Job.count({ where: { postedBy: userId, status: 'closed' } });

  return { totalJobs, activeJobs, closedJobs };
}
