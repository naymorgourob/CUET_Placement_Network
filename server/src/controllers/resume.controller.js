import * as resumeService from '../services/resume.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function upload(req, res, next) {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'A PDF resume file is required.');
    }

    const resume = await resumeService.uploadResume(req.user.userId, req.file);
    return successResponse(res, 201, 'Resume uploaded successfully.', {
      resumeId: resume.resumeId,
      filePath: resume.filePath,
      uploadedAt: resume.uploadedAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyResumes(req, res, next) {
  try {
    const resumes = await resumeService.getMyResumes(req.user.userId);
    return successResponse(res, 200, 'Resumes retrieved.', resumes);
  } catch (error) {
    next(error);
  }
}

export async function getResumeDetails(req, res, next) {
  try {
    const resume = await resumeService.getResumeDetails(req.user.userId, req.params.resumeId);
    return successResponse(res, 200, 'Resume details retrieved.', resume);
  } catch (error) {
    next(error);
  }
}

export async function setCurrentResume(req, res, next) {
  try {
    const resume = await resumeService.setCurrentResume(req.user.userId, req.params.resumeId);
    return successResponse(res, 200, 'Current resume updated.', { currentResumeId: resume.resumeId });
  } catch (error) {
    next(error);
  }
}

export async function deleteResume(req, res, next) {
  try {
    await resumeService.deleteResume(req.user.userId, req.params.resumeId);
    return successResponse(res, 200, 'Resume deleted successfully.');
  } catch (error) {
    next(error);
  }
}

export async function analyzeResume(req, res, next) {
  try {
    const analysis = await resumeService.analyzeResume(req.user.userId, req.params.resumeId);
    return successResponse(res, 200, 'Resume analysis retrieved.', analysis);
  } catch (error) {
    next(error);
  }
}

export async function getResumeAnalysis(req, res, next) {
  try {
    const analysis = await resumeService.getResumeAnalysis(req.user.userId, req.params.resumeId);
    return successResponse(res, 200, 'Resume analysis retrieved.', analysis);
  } catch (error) {
    next(error);
  }
}

export async function generateImprovementSuggestions(req, res, next) {
  try {
    const suggestions = await resumeService.generateResumeImprovementSuggestions(req.user.userId, req.params.resumeId);
    return successResponse(res, 200, 'Resume improvement suggestions retrieved.', suggestions);
  } catch (error) {
    next(error);
  }
}

export async function getImprovementSuggestions(req, res, next) {
  try {
    const suggestions = await resumeService.getResumeImprovementSuggestions(req.user.userId, req.params.resumeId);
    return successResponse(res, 200, 'Resume improvement suggestions retrieved.', suggestions);
  } catch (error) {
    next(error);
  }
}
