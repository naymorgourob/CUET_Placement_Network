import * as studentService from '../services/student.service.js';
import { successResponse } from '../utils/apiResponse.js';

export async function getMe(req, res, next) {
  try {
    const profile = await studentService.getProfile(req.user.userId);
    return successResponse(res, 200, 'Student profile retrieved.', profile);
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const profile = await studentService.updateProfile(req.user.userId, req.body);
    return successResponse(res, 200, 'Student profile updated.', profile);
  } catch (error) {
    next(error);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const summary = await studentService.getDashboardSummary(req.user.userId);
    return successResponse(res, 200, 'Dashboard summary retrieved.', summary);
  } catch (error) {
    next(error);
  }
}
