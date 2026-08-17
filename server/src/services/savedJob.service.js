import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';

async function getStudentProfile(userId) {
  const profile = await db.StudentProfile.findOne({ where: { userId } });

  if (!profile) {
    throw new AppError(404, 'Student profile not found.');
  }

  return profile;
}

export async function saveJob(userId, jobId) {
  const profile = await getStudentProfile(userId);

  const job = await db.Job.findByPk(jobId);

  if (!job || job.status === 'removed') {
    throw new AppError(404, 'Job not found.');
  }

  const existing = await db.SavedJob.findOne({
    where: { studentProfileId: profile.studentProfileId, jobId },
  });

  if (existing) {
    return existing;
  }

  return db.SavedJob.create({ studentProfileId: profile.studentProfileId, jobId });
}

export async function unsaveJob(userId, jobId) {
  const profile = await getStudentProfile(userId);

  const deleted = await db.SavedJob.destroy({
    where: { studentProfileId: profile.studentProfileId, jobId },
  });

  if (!deleted) {
    throw new AppError(404, 'This job is not in your saved jobs.');
  }
}

export async function listSavedJobs(userId) {
  const profile = await getStudentProfile(userId);

  const savedJobs = await db.SavedJob.findAll({
    where: { studentProfileId: profile.studentProfileId },
    include: [
      {
        model: db.Job,
        include: [{ model: db.Company, attributes: ['companyId', 'name', 'industry', 'logoPath'] }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return savedJobs
    .filter((savedJob) => savedJob.Job && savedJob.Job.status !== 'removed')
    .map((savedJob) => ({
      savedJobId: savedJob.savedJobId,
      savedAt: savedJob.createdAt,
      job: savedJob.Job,
    }));
}

export async function getSavedJobIds(userId) {
  const profile = await getStudentProfile(userId);

  const savedJobs = await db.SavedJob.findAll({
    where: { studentProfileId: profile.studentProfileId },
    attributes: ['jobId'],
  });

  return savedJobs.map((savedJob) => savedJob.jobId);
}
