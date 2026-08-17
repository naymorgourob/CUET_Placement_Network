import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { getRecruiterJobStats } from './job.service.js';
import { getRecruiterApplicationStats, getRecentApplicationsForRecruiter } from './application.service.js';

async function getRecruiterProfileByUserId(userId) {
  const profile = await db.RecruiterProfile.findOne({ where: { userId } });

  if (!profile) {
    throw new AppError(404, 'Recruiter profile not found.');
  }

  return profile;
}

export async function getProfile(userId) {
  return getRecruiterProfileByUserId(userId);
}

export async function updateProfile(userId, updates) {
  const profile = await getRecruiterProfileByUserId(userId);

  const { designation, phone } = updates;

  await profile.update({
    ...(designation !== undefined && { designation }),
    ...(phone !== undefined && { phone }),
  });

  return profile;
}

export async function getDashboardSummary(userId) {
  const profile = await getRecruiterProfileByUserId(userId);

  const company = profile.companyId
    ? await db.Company.findByPk(profile.companyId)
    : null;

  const { totalJobs, activeJobs, closedJobs } = await getRecruiterJobStats(userId);
  const applicationStats = await getRecruiterApplicationStats(userId);
  const recentApplications = await getRecentApplicationsForRecruiter(userId);

  return {
    recruiterProfile: profile,
    companyProfile: company,
    isVerified: profile.isVerified,
    totalJobs,
    activeJobs,
    closedJobs,
    totalApplications: applicationStats.totalApplications,
    applicationStats,
    recentApplications,
  };
}
