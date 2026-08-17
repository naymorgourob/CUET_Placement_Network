import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { generateJobMatch } from './ai.service.js';

// Match is considered stale (§9) if either the Job or the ResumeAnalysis
// was updated after the cached match was computed — the simplest safe
// timestamp comparison available given this project's schema does not
// track a separate "version" field on either table. This intentionally
// errs toward recomputing rather than risking a silently outdated score.
function isMatchStale(match, job, analysis) {
  const matchCreatedAt = new Date(match.createdAt).getTime();
  return new Date(job.updatedAt).getTime() > matchCreatedAt || new Date(analysis.updatedAt).getTime() > matchCreatedAt;
}

function parseSkillList(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function serializeMatch(match) {
  return {
    matchScoreId: match.matchScoreId,
    jobId: match.jobId,
    resumeId: match.resumeId,
    matchScore: Number(match.score),
    summary: match.summary,
    matchingSkills: match.matchingSkills ?? [],
    missingSkills: parseSkillList(match.missingSkills),
    matchingQualifications: match.matchingQualifications ?? [],
    gaps: match.gaps ?? [],
    strengthsForThisJob: match.strengthsForThisJob ?? [],
    recommendations: match.recommendations ?? [],
    aiModel: match.aiModel,
    computedAt: match.computedAt,
  };
}

// Screening-only view for recruiters — deliberately excludes summary/gaps/
// recommendations/matchingQualifications/strengthsForThisJob, none of which
// are needed to screen a candidate and some of which read as more personal
// framing than a bare skill/score comparison. See
// docs/Feature08_AIJobMatchScore.md §11.
function serializeMatchForRecruiter(match) {
  return {
    matchScore: Number(match.score),
    matchingSkills: match.matchingSkills ?? [],
    missingSkills: parseSkillList(match.missingSkills),
    computedAt: match.computedAt,
  };
}

async function getResumeAndAnalysis(resumeId) {
  const resume = await db.Resume.findByPk(resumeId);

  if (!resume) {
    throw new AppError(404, 'Resume not found.');
  }

  const analysis = await db.ResumeAnalysis.findOne({ where: { resumeId } });

  if (!analysis || !analysis.aiModel) {
    throw new AppError(409, 'Analyze your resume before checking job compatibility.');
  }

  return { resume, analysis };
}

async function getScoreableJob(jobId) {
  const job = await db.Job.findByPk(jobId);

  if (!job || job.status === 'removed') {
    throw new AppError(404, 'Job not found.');
  }

  return job;
}

async function computeOrReuseMatch(job, resume, analysis) {
  const existingMatch = await db.MatchScore.findOne({ where: { jobId: job.jobId, resumeId: resume.resumeId } });

  // Cache reuse (§8) + stale-result safety (§9): a cached match is only
  // returned as-is when it already has structured AI output (aiModel set —
  // same discriminator pattern Feature 06/07 use, not the frozen `score`/
  // `missingSkills` fields alone) AND neither the job nor the analysis has
  // changed since it was computed.
  if (existingMatch && existingMatch.aiModel && !isMatchStale(existingMatch, job, analysis)) {
    return existingMatch;
  }

  const { payload, model } = await generateJobMatch(analysis, job);

  const matchData = {
    jobId: job.jobId,
    resumeId: resume.resumeId,
    score: payload.matchScore,
    missingSkills: JSON.stringify(payload.missingSkills),
    summary: payload.summary,
    matchingSkills: payload.matchingSkills,
    matchingQualifications: payload.matchingQualifications,
    gaps: payload.gaps,
    strengthsForThisJob: payload.strengthsForThisJob,
    recommendations: payload.recommendations,
    aiModel: model,
    computedAt: new Date(),
  };

  if (existingMatch) {
    await existingMatch.update(matchData);
    return existingMatch;
  }

  return db.MatchScore.create(matchData);
}

// Student flow: identity comes from req.user.userId → StudentProfile →
// currentResumeId. studentId/resumeId are never accepted from the client.
export async function generateOrGetJobMatchForStudent(userId, jobId) {
  const profile = await db.StudentProfile.findOne({ where: { userId } });

  if (!profile) {
    throw new AppError(404, 'Student profile not found.');
  }

  if (!profile.currentResumeId) {
    throw new AppError(409, 'Analyze your resume before checking job compatibility.');
  }

  const job = await getScoreableJob(jobId);
  const { resume, analysis } = await getResumeAndAnalysis(profile.currentResumeId);

  const match = await computeOrReuseMatch(job, resume, analysis);
  return serializeMatch(match);
}

export async function getJobMatchForStudent(userId, jobId) {
  const profile = await db.StudentProfile.findOne({ where: { userId } });

  if (!profile) {
    throw new AppError(404, 'Student profile not found.');
  }

  if (!profile.currentResumeId) {
    throw new AppError(409, 'Analyze your resume before checking job compatibility.');
  }

  const match = await db.MatchScore.findOne({ where: { jobId, resumeId: profile.currentResumeId } });

  if (!match || !match.aiModel) {
    throw new AppError(404, 'No match result has been generated for this job yet.');
  }

  return serializeMatch(match);
}

// Recruiter flow: identity/ownership comes from req.user.userId → the
// Application's parent Job.postedBy. The recruiter never supplies a
// resumeId or studentId — only an applicationId they must own via the job.
export async function generateOrGetJobMatchForRecruiter(userId, applicationId) {
  const application = await db.Application.findByPk(applicationId, {
    include: [{ model: db.Job }],
  });

  if (!application) {
    throw new AppError(404, 'Application not found.');
  }

  if (!application.Job || application.Job.postedBy !== userId) {
    throw new AppError(403, 'You do not have permission to access this application.');
  }

  const job = application.Job;
  const { resume, analysis } = await getResumeAndAnalysis(application.resumeId);

  const match = await computeOrReuseMatch(job, resume, analysis);
  return serializeMatchForRecruiter(match);
}

export async function getJobMatchForRecruiter(userId, applicationId) {
  const application = await db.Application.findByPk(applicationId, {
    include: [{ model: db.Job }],
  });

  if (!application) {
    throw new AppError(404, 'Application not found.');
  }

  if (!application.Job || application.Job.postedBy !== userId) {
    throw new AppError(403, 'You do not have permission to access this application.');
  }

  const match = await db.MatchScore.findOne({
    where: { jobId: application.jobId, resumeId: application.resumeId },
  });

  if (!match || !match.aiModel) {
    throw new AppError(404, 'No match result has been generated for this applicant yet.');
  }

  return serializeMatchForRecruiter(match);
}
