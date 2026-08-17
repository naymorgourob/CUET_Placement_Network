import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';

const PROFILE_FIELDS_FOR_COMPLETION = ['department', 'batchYear', 'cgpa', 'phone', 'skills'];

async function getProfileByUserId(userId) {
  const profile = await db.StudentProfile.findOne({ where: { userId } });

  if (!profile) {
    throw new AppError(404, 'Student profile not found.');
  }

  return profile;
}

export async function getProfile(userId) {
  return getProfileByUserId(userId);
}

export async function updateProfile(userId, updates) {
  const profile = await getProfileByUserId(userId);

  const { department, batchYear, cgpa, phone, skills } = updates;

  await profile.update({
    ...(department !== undefined && { department }),
    ...(batchYear !== undefined && { batchYear }),
    ...(cgpa !== undefined && { cgpa }),
    ...(phone !== undefined && { phone }),
    ...(skills !== undefined && { skills }),
  });

  return profile;
}

function calculateProfileCompletion(profile) {
  const filledCount = PROFILE_FIELDS_FOR_COMPLETION.filter((field) => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== '';
  }).length;

  return Math.round((filledCount / PROFILE_FIELDS_FOR_COMPLETION.length) * 100);
}

export async function getDashboardSummary(userId) {
  const profile = await getProfileByUserId(userId);

  const totalApplications = await db.Application.count({
    where: { studentProfileId: profile.studentProfileId },
  });

  return {
    profile,
    hasResume: Boolean(profile.currentResumeId),
    totalApplications,
    profileCompletionPercentage: calculateProfileCompletion(profile),
  };
}
