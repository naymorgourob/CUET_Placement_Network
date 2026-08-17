import * as recruiterService from '../services/recruiter.service.js';
import * as applicationService from '../services/application.service.js';
import { successResponse } from '../utils/apiResponse.js';

export async function getMe(req, res, next) {
  try {
    const profile = await recruiterService.getProfile(req.user.userId);
    return successResponse(res, 200, 'Recruiter profile retrieved.', profile);
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const profile = await recruiterService.updateProfile(req.user.userId, req.body);
    return successResponse(res, 200, 'Recruiter profile updated.', profile);
  } catch (error) {
    next(error);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const summary = await recruiterService.getDashboardSummary(req.user.userId);
    return successResponse(res, 200, 'Dashboard summary retrieved.', summary);
  } catch (error) {
    next(error);
  }
}

export async function getMyApplications(req, res, next) {
  try {
    const result = await applicationService.getApplicationsForRecruiter(req.user.userId, req.query);
    return successResponse(res, 200, 'Applications retrieved.', result);
  } catch (error) {
    next(error);
  }
}
