import * as applicationService from '../services/application.service.js';
import * as jobMatchService from '../services/jobMatch.service.js';
import { successResponse } from '../utils/apiResponse.js';

export async function applyForJob(req, res, next) {
  try {
    const application = await applicationService.applyForJob(req.user.userId, req.params.jobId, req.body?.coverLetter);
    return successResponse(res, 201, 'Application submitted successfully.', application);
  } catch (error) {
    next(error);
  }
}

export async function getMyApplications(req, res, next) {
  try {
    const result = await applicationService.getMyApplications(req.user.userId, req.query);
    return successResponse(res, 200, 'Applications retrieved.', result);
  } catch (error) {
    next(error);
  }
}

export async function getApplicantsForJob(req, res, next) {
  try {
    const result = await applicationService.getApplicantsForJob(req.user.userId, req.params.jobId, req.query);
    return successResponse(res, 200, 'Applicants retrieved.', result);
  } catch (error) {
    next(error);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const application = await applicationService.updateApplicationStatus(
      req.user.userId,
      req.params.applicationId,
      req.body.status
    );
    return successResponse(res, 200, 'Application status updated.', application);
  } catch (error) {
    next(error);
  }
}

export async function getApplicationDetails(req, res, next) {
  try {
    const application = await applicationService.getApplicationDetails(req.user, req.params.applicationId);
    return successResponse(res, 200, 'Application details retrieved.', application);
  } catch (error) {
    next(error);
  }
}

export async function generateApplicantMatch(req, res, next) {
  try {
    const match = await jobMatchService.generateOrGetJobMatchForRecruiter(req.user.userId, req.params.applicationId);
    return successResponse(res, 200, 'Applicant match retrieved.', match);
  } catch (error) {
    next(error);
  }
}

export async function getApplicantMatch(req, res, next) {
  try {
    const match = await jobMatchService.getJobMatchForRecruiter(req.user.userId, req.params.applicationId);
    return successResponse(res, 200, 'Applicant match retrieved.', match);
  } catch (error) {
    next(error);
  }
}
