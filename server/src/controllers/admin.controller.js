import * as adminService from '../services/admin.service.js';
import { successResponse } from '../utils/apiResponse.js';

export async function getDashboard(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    return successResponse(res, 200, 'Dashboard statistics retrieved.', stats);
  } catch (error) {
    next(error);
  }
}

export async function listRecruiters(req, res, next) {
  try {
    const recruiters = await adminService.listRecruiters(req.query.status);
    return successResponse(res, 200, 'Recruiters retrieved.', recruiters);
  } catch (error) {
    next(error);
  }
}

export async function verifyRecruiter(req, res, next) {
  try {
    const recruiter = await adminService.verifyRecruiter(req.user.userId, req.params.id);
    return successResponse(res, 200, 'Recruiter verified.', {
      isVerified: recruiter.isVerified,
      verifiedAt: recruiter.verifiedAt,
      verifiedBy: recruiter.verifiedBy,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectRecruiter(req, res, next) {
  try {
    const recruiter = await adminService.rejectRecruiter(req.user.userId, req.params.id);
    return successResponse(res, 200, 'Recruiter rejected.', {
      isVerified: recruiter.isVerified,
    });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(req, res, next) {
  try {
    const result = await adminService.listUsers(req.query);
    return successResponse(res, 200, 'Users retrieved.', result);
  } catch (error) {
    next(error);
  }
}

export async function suspendUser(req, res, next) {
  try {
    const user = await adminService.suspendUser(req.params.userId);
    return successResponse(res, 200, 'User suspended.', { isActive: user.isActive });
  } catch (error) {
    next(error);
  }
}

export async function reactivateUser(req, res, next) {
  try {
    const user = await adminService.reactivateUser(req.params.userId);
    return successResponse(res, 200, 'User reactivated.', { isActive: user.isActive });
  } catch (error) {
    next(error);
  }
}

export async function listJobs(req, res, next) {
  try {
    const result = await adminService.listJobsForModeration(req.query);
    return successResponse(res, 200, 'Jobs retrieved.', result);
  } catch (error) {
    next(error);
  }
}

export async function removeJob(req, res, next) {
  try {
    const job = await adminService.removeJob(req.params.jobId);
    return successResponse(res, 200, 'Job removed.', { status: job.status });
  } catch (error) {
    next(error);
  }
}

export async function getReports(req, res, next) {
  try {
    const report = await adminService.getReports(req.query);
    return successResponse(res, 200, 'Report retrieved.', report);
  } catch (error) {
    next(error);
  }
}

export async function exportReports(req, res, next) {
  try {
    const report = await adminService.exportReports(req.query);
    return successResponse(res, 200, 'Report exported.', report);
  } catch (error) {
    next(error);
  }
}
