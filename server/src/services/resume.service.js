import { Op } from 'sequelize';
import fs from 'fs/promises';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import db from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { analyzeResumeText, generateImprovementSuggestions } from './ai.service.js';

const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_PATH || 'uploads');

// filePath is always stored relative to UPLOAD_ROOT (e.g. "resumes/foo.pdf"),
// matching the convention used for company logos and resource cover images
// (Company.logoPath, Resource.coverImagePath) so the frontend can build a
// file URL the same way everywhere: `${uploadBaseUrl}/${filePath}`.
function toRelativeUploadPath(absoluteOrRelativePath) {
  const absolute = path.resolve(absoluteOrRelativePath);
  return path.relative(UPLOAD_ROOT, absolute).split(path.sep).join('/');
}

async function getStudentProfileByUserId(userId) {
  const profile = await db.StudentProfile.findOne({ where: { userId } });

  if (!profile) {
    throw new AppError(404, 'Student profile not found.');
  }

  return profile;
}

async function getOwnedResume(resumeId, studentProfileId) {
  const resume = await db.Resume.findByPk(resumeId);

  if (!resume) {
    throw new AppError(404, 'Resume not found.');
  }

  if (resume.studentProfileId !== studentProfileId) {
    throw new AppError(403, 'You do not have permission to access this resume.');
  }

  return resume;
}

export async function uploadResume(userId, file) {
  return db.sequelize.transaction(async (transaction) => {
    const profile = await db.StudentProfile.findOne({ where: { userId }, transaction });

    if (!profile) {
      throw new AppError(404, 'Student profile not found.');
    }

    const resume = await db.Resume.create(
      {
        studentProfileId: profile.studentProfileId,
        filePath: toRelativeUploadPath(file.path),
        originalFileName: file.originalname,
      },
      { transaction }
    );

    if (!profile.currentResumeId) {
      await profile.update({ currentResumeId: resume.resumeId }, { transaction });
    }

    return resume;
  });
}

export async function getMyResumes(userId) {
  const profile = await getStudentProfileByUserId(userId);

  return db.Resume.findAll({
    where: { studentProfileId: profile.studentProfileId },
    order: [['uploadedAt', 'DESC']],
  });
}

export async function getResumeDetails(userId, resumeId) {
  const profile = await getStudentProfileByUserId(userId);
  return getOwnedResume(resumeId, profile.studentProfileId);
}

export async function setCurrentResume(userId, resumeId) {
  const profile = await getStudentProfileByUserId(userId);
  const resume = await getOwnedResume(resumeId, profile.studentProfileId);

  await profile.update({ currentResumeId: resume.resumeId });

  return resume;
}

export async function deleteResume(userId, resumeId) {
  const profile = await getStudentProfileByUserId(userId);
  const resume = await getOwnedResume(resumeId, profile.studentProfileId);

  const totalResumes = await db.Resume.count({ where: { studentProfileId: profile.studentProfileId } });

  if (totalResumes === 1) {
    throw new AppError(400, 'Cannot delete your only resume.');
  }

  return db.sequelize.transaction(async (transaction) => {
    await db.ResumeAnalysis.destroy({ where: { resumeId: resume.resumeId }, transaction });

    if (profile.currentResumeId === resume.resumeId) {
      const nextResume = await db.Resume.findOne({
        where: { studentProfileId: profile.studentProfileId, resumeId: { [Op.ne]: resume.resumeId } },
        order: [['uploadedAt', 'DESC']],
        transaction,
      });

      await profile.update({ currentResumeId: nextResume ? nextResume.resumeId : null }, { transaction });
    }

    await resume.destroy({ transaction });
  });
}

async function extractResumeText(resume) {
  const absolutePath = path.resolve(UPLOAD_ROOT, resume.filePath);

  let buffer;
  try {
    buffer = await fs.readFile(absolutePath);
  } catch {
    throw new AppError(500, 'The resume file could not be read from storage.');
  }

  let text;
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    text = result.text;
  } catch {
    throw new AppError(422, 'The resume content could not be extracted. The PDF may be corrupted or image-only.');
  }

  if (!text || !text.trim()) {
    throw new AppError(422, 'The resume content could not be extracted. The PDF appears to have no readable text.');
  }

  return text;
}

export async function analyzeResume(userId, resumeId) {
  const profile = await getStudentProfileByUserId(userId);
  const resume = await getOwnedResume(resumeId, profile.studentProfileId);

  const existingAnalysis = await db.ResumeAnalysis.findOne({ where: { resumeId: resume.resumeId } });

  // Rate/abuse protection: a resume that already has a valid structured
  // analysis is returned as-is rather than re-calling Gemini. Re-analysis
  // is not exposed by this feature — see docs/Feature06_AIResumeAnalysis.md §10.
  // Checked via aiModel (only ever set by this feature's write path), not
  // summary — Gemini can legitimately return an empty-string summary for a
  // terse resume, which is valid analyzed output, not "unanalyzed."
  if (existingAnalysis && existingAnalysis.aiModel) {
    return existingAnalysis;
  }

  const resumeText = await extractResumeText(resume);
  const { payload, model, truncated } = await analyzeResumeText(resumeText);

  const analysisData = {
    resumeId: resume.resumeId,
    summary: truncated ? `${payload.summary}\n\n(Note: only the first portion of this resume was analyzed.)` : payload.summary,
    skills: payload.skills,
    education: payload.education,
    experience: payload.experience,
    projects: payload.projects,
    certifications: payload.certifications,
    strengths: payload.strengths,
    weaknesses: payload.weaknesses,
    missingInformation: payload.missingInformation,
    aiModel: model,
    analyzedAt: new Date(),
  };

  if (existingAnalysis) {
    await existingAnalysis.update(analysisData);
    return existingAnalysis;
  }

  return db.ResumeAnalysis.create(analysisData);
}

export async function getResumeAnalysis(userId, resumeId) {
  const profile = await getStudentProfileByUserId(userId);
  const resume = await getOwnedResume(resumeId, profile.studentProfileId);

  const analysis = await db.ResumeAnalysis.findOne({ where: { resumeId: resume.resumeId } });

  if (!analysis || !analysis.aiModel) {
    throw new AppError(404, 'This resume has not been analyzed yet.');
  }

  return analysis;
}

// improvementSuggestions is the pre-existing, frozen (Freeze #04) TEXT
// field on ResumeAnalysis — previously unused by Feature 06. Feature 07
// reuses it by storing the structured suggestion payload as a JSON string
// (Sequelize TEXT columns, unlike JSON columns, do not auto-parse) rather
// than adding new columns — see docs/Feature07_AIResumeImprovement.md §6.
function parseStoredSuggestions(analysis) {
  if (!analysis.improvementSuggestions) {
    return null;
  }

  try {
    return JSON.parse(analysis.improvementSuggestions);
  } catch {
    return null;
  }
}

export async function generateResumeImprovementSuggestions(userId, resumeId) {
  const profile = await getStudentProfileByUserId(userId);
  const resume = await getOwnedResume(resumeId, profile.studentProfileId);

  const analysis = await db.ResumeAnalysis.findOne({ where: { resumeId: resume.resumeId } });

  if (!analysis || !analysis.aiModel) {
    throw new AppError(409, 'Analyze your resume before generating improvement suggestions.');
  }

  // Rate/abuse protection, mirroring Feature 06's reuse pattern exactly:
  // if suggestions already exist for this analysis, return them without
  // calling Gemini again. No regeneration mechanism is exposed here.
  const existingSuggestions = parseStoredSuggestions(analysis);
  if (existingSuggestions) {
    return { analysisId: analysis.analysisId, resumeId: resume.resumeId, ...existingSuggestions };
  }

  const { payload, model } = await generateImprovementSuggestions(analysis);

  await analysis.update({
    improvementSuggestions: JSON.stringify({ ...payload, suggestionsModel: model }),
  });

  return { analysisId: analysis.analysisId, resumeId: resume.resumeId, ...payload, suggestionsModel: model };
}

export async function getResumeImprovementSuggestions(userId, resumeId) {
  const profile = await getStudentProfileByUserId(userId);
  const resume = await getOwnedResume(resumeId, profile.studentProfileId);

  const analysis = await db.ResumeAnalysis.findOne({ where: { resumeId: resume.resumeId } });

  if (!analysis || !analysis.aiModel) {
    throw new AppError(409, 'Analyze your resume before generating improvement suggestions.');
  }

  const suggestions = parseStoredSuggestions(analysis);

  if (!suggestions) {
    throw new AppError(404, 'Improvement suggestions have not been generated for this resume yet.');
  }

  return { analysisId: analysis.analysisId, resumeId: resume.resumeId, ...suggestions };
}
