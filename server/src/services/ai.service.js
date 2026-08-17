import { GoogleGenAI, Type } from '@google/genai';
import { AppError } from '../utils/AppError.js';
import {
  buildResumeAnalysisPrompt,
  buildResumeAnalysisResponseSchema,
} from '../constants/resumeAnalysisPrompt.js';
import {
  buildResumeImprovementPrompt,
  buildResumeImprovementResponseSchema,
} from '../constants/resumeImprovementPrompt.js';
import { buildJobMatchPrompt, buildJobMatchResponseSchema } from '../constants/jobMatchPrompt.js';

// 'gemini-2.5-flash' (a pinned version string) returns 404 "no longer
// available to new users" for newer API keys even though it still appears
// in models.list() — a known Gemini API quirk, confirmed live against the
// real API during verification. 'gemini-flash-latest' is Google's rolling
// alias for their current recommended fast model and was confirmed working
// live — use the alias rather than a version pin so this doesn't silently
// break again the next time a pinned version is deprecated for new keys.
const GEMINI_MODEL = 'gemini-flash-latest';

// Resume text is bounded before it ever reaches Gemini — this is a
// character cap on the *extracted* text (not the PDF file size, which
// multer already caps separately in upload.middleware.js). ~40k characters
// comfortably covers even a dense multi-page resume while keeping the
// prompt well inside the model's context window and avoiding an
// unbounded-cost request.
const MAX_RESUME_TEXT_LENGTH = 40_000;

let cachedClient = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key') {
    throw new AppError(503, 'AI analysis is not configured. Please try again later.');
  }

  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }

  return cachedClient;
}

function isNonEmptyString(value) {
  return typeof value === 'string';
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isValidEducationEntry(entry) {
  return (
    entry &&
    typeof entry === 'object' &&
    isNonEmptyString(entry.degree) &&
    isNonEmptyString(entry.institution) &&
    isNonEmptyString(entry.field) &&
    isNonEmptyString(entry.startYear) &&
    isNonEmptyString(entry.endYear)
  );
}

function isValidExperienceEntry(entry) {
  return (
    entry &&
    typeof entry === 'object' &&
    isNonEmptyString(entry.title) &&
    isNonEmptyString(entry.company) &&
    isNonEmptyString(entry.duration) &&
    isNonEmptyString(entry.description)
  );
}

function isValidProjectEntry(entry) {
  return (
    entry &&
    typeof entry === 'object' &&
    isNonEmptyString(entry.name) &&
    isNonEmptyString(entry.description) &&
    isStringArray(entry.technologies)
  );
}

const VALID_PRIORITIES = new Set(['high', 'medium', 'low']);

function isValidPriorityImprovementEntry(entry) {
  return (
    entry &&
    typeof entry === 'object' &&
    isNonEmptyString(entry.area) &&
    isNonEmptyString(entry.issue) &&
    isNonEmptyString(entry.suggestion) &&
    typeof entry.priority === 'string' &&
    VALID_PRIORITIES.has(entry.priority)
  );
}

function isValidSkillSuggestionEntry(entry) {
  return entry && typeof entry === 'object' && isNonEmptyString(entry.skill) && isNonEmptyString(entry.reason);
}

function isValidContentSuggestionEntry(entry) {
  return entry && typeof entry === 'object' && isNonEmptyString(entry.section) && isNonEmptyString(entry.suggestion);
}

function isValidMatchScore(value) {
  return Number.isInteger(value) && value >= 0 && value <= 100;
}

// Never trust raw AI output. Every field is structurally verified before
// anything is persisted — a malformed response is rejected wholesale
// rather than partially saved.
export function validateJobMatchPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  if (!isValidMatchScore(payload.matchScore)) return false;
  if (!isNonEmptyString(payload.summary)) return false;
  if (!isStringArray(payload.matchingQualifications)) return false;
  if (!isStringArray(payload.gaps)) return false;
  if (!isStringArray(payload.strengthsForThisJob)) return false;
  if (!isStringArray(payload.recommendations)) return false;

  // matchingSkills/missingSkills share the exact {skill, reason} shape
  // already validated for Feature 07's skillSuggestions — reused, not
  // duplicated.
  if (!Array.isArray(payload.matchingSkills) || !payload.matchingSkills.every(isValidSkillSuggestionEntry)) {
    return false;
  }
  if (!Array.isArray(payload.missingSkills) || !payload.missingSkills.every(isValidSkillSuggestionEntry)) {
    return false;
  }

  return true;
}

// Never trust raw AI output. Every field is structurally verified before
// anything is persisted — a malformed response is rejected wholesale
// rather than partially saved.
export function validateResumeImprovementPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  if (!isNonEmptyString(payload.overallAssessment)) return false;
  if (!isStringArray(payload.missingInformation)) return false;
  if (!isStringArray(payload.actionItems)) return false;

  if (!Array.isArray(payload.priorityImprovements) || !payload.priorityImprovements.every(isValidPriorityImprovementEntry)) {
    return false;
  }
  if (!Array.isArray(payload.skillSuggestions) || !payload.skillSuggestions.every(isValidSkillSuggestionEntry)) {
    return false;
  }
  if (!Array.isArray(payload.contentSuggestions) || !payload.contentSuggestions.every(isValidContentSuggestionEntry)) {
    return false;
  }

  return true;
}

// Never trust raw AI output. Every field is structurally verified before
// anything is persisted — a malformed response is rejected wholesale
// rather than partially saved.
export function validateResumeAnalysisPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  if (!isNonEmptyString(payload.summary)) return false;
  if (!isStringArray(payload.skills)) return false;
  if (!isStringArray(payload.certifications)) return false;
  if (!isStringArray(payload.strengths)) return false;
  if (!isStringArray(payload.weaknesses)) return false;
  if (!isStringArray(payload.missingInformation)) return false;

  if (!Array.isArray(payload.education) || !payload.education.every(isValidEducationEntry)) return false;
  if (!Array.isArray(payload.experience) || !payload.experience.every(isValidExperienceEntry)) return false;
  if (!Array.isArray(payload.projects) || !payload.projects.every(isValidProjectEntry)) return false;

  return true;
}

function parseJsonResponse(rawText) {
  // responseMimeType: 'application/json' means Gemini should not wrap the
  // output in markdown fences, but strip them defensively in case a model
  // response ever does — never depend on free-form prose parsing beyond this.
  const cleaned = rawText.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// Shared Gemini call + safe error mapping, reused by both resume analysis
// (Feature 06) and resume improvement suggestions (Feature 07) — one
// Gemini client, one error-handling policy, not duplicated per feature.
async function generateStructuredContent({ prompt, responseSchema, unavailableMessage, busyMessage, failedMessage }) {
  const client = getClient();

  let response;
  try {
    response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.2,
      },
    });
  } catch (error) {
    // Never surface the raw SDK error (may reference the API key/request
    // internals) or any resume content to the client or to logs.
    console.error('Gemini request failed:', error?.status ?? error?.code ?? 'unknown error');

    if (error?.status === 401 || error?.status === 403) {
      throw new AppError(503, unavailableMessage);
    }

    if (error?.status === 429) {
      throw new AppError(503, busyMessage);
    }

    throw new AppError(503, failedMessage);
  }

  const responseText = response?.text;

  if (!responseText) {
    throw new AppError(502, 'AI response was empty. Please try again.');
  }

  return parseJsonResponse(responseText);
}

export async function analyzeResumeText(resumeText) {
  if (!resumeText || !resumeText.trim()) {
    throw new AppError(422, 'The resume content could not be extracted. Please upload a text-based PDF resume.');
  }

  const truncated = resumeText.length > MAX_RESUME_TEXT_LENGTH;
  const boundedText = truncated ? resumeText.slice(0, MAX_RESUME_TEXT_LENGTH) : resumeText;

  const prompt = buildResumeAnalysisPrompt(boundedText);

  const parsed = await generateStructuredContent({
    prompt,
    responseSchema: buildResumeAnalysisResponseSchema(Type),
    unavailableMessage: 'AI analysis is temporarily unavailable. Please try again later.',
    busyMessage: 'AI analysis is busy right now. Please try again in a moment.',
    failedMessage: 'AI analysis failed. Please try again later.',
  });

  if (!parsed || !validateResumeAnalysisPayload(parsed)) {
    throw new AppError(502, 'AI analysis returned an invalid response. Please try again.');
  }

  return {
    payload: parsed,
    model: GEMINI_MODEL,
    truncated,
  };
}

// Generates improvement suggestions from an already-stored, structured
// ResumeAnalysis — never re-reads the PDF, never re-extracts text. See
// docs/Feature07_AIResumeImprovement.md §3.
export async function generateImprovementSuggestions(analysis) {
  const prompt = buildResumeImprovementPrompt(analysis);

  const parsed = await generateStructuredContent({
    prompt,
    responseSchema: buildResumeImprovementResponseSchema(Type),
    unavailableMessage: 'AI suggestions are temporarily unavailable. Please try again later.',
    busyMessage: 'AI suggestions are busy right now. Please try again in a moment.',
    failedMessage: 'AI suggestions failed. Please try again later.',
  });

  if (!parsed || !validateResumeImprovementPayload(parsed)) {
    throw new AppError(502, 'AI suggestions returned an invalid response. Please try again.');
  }

  return {
    payload: parsed,
    model: GEMINI_MODEL,
  };
}

// Scores an already-stored, structured ResumeAnalysis against a Job's own
// stored fields — never re-reads the PDF, never re-runs resume analysis,
// never re-extracts text. See docs/Feature08_AIJobMatchScore.md §4.
export async function generateJobMatch(analysis, job) {
  const prompt = buildJobMatchPrompt(analysis, job);

  const parsed = await generateStructuredContent({
    prompt,
    responseSchema: buildJobMatchResponseSchema(Type),
    unavailableMessage: 'AI match scoring is temporarily unavailable. Please try again later.',
    busyMessage: 'AI match scoring is busy right now. Please try again in a moment.',
    failedMessage: 'AI match scoring failed. Please try again later.',
  });

  if (!parsed || !validateJobMatchPayload(parsed)) {
    throw new AppError(502, 'AI match scoring returned an invalid response. Please try again.');
  }

  return {
    payload: parsed,
    model: GEMINI_MODEL,
  };
}
