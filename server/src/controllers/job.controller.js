import * as jobService from '../services/job.service.js';
import * as jobMatchService from '../services/jobMatch.service.js';
import { successResponse } from '../utils/apiResponse.js';

export async function createJob(req, res, next) {
  try {
    const job = await jobService.createJob(req.user.userId, req.body);
    return successResponse(res, 201, 'Job created successfully.', job);
  } catch (error) {
    next(error);
  }
}

export async function updateJob(req, res, next) {
  try {
    const job = await jobService.updateJob(req.user.userId, req.params.jobId, req.body);
    return successResponse(res, 200, 'Job updated successfully.', job);
  } catch (error) {
    next(error);
  }
}

export async function closeJob(req, res, next) {
  try {
    const job = await jobService.closeJob(req.user.userId, req.params.jobId);
    return successResponse(res, 200, 'Job closed.', { status: job.status });
  } catch (error) {
    next(error);
  }
}

export async function deleteJob(req, res, next) {
  try {
    const result = await jobService.deleteJob(req.user.userId, req.params.jobId);

    if (result.mode === 'soft') {
      return successResponse(res, 200, 'This job had existing applications, so it was marked as removed instead of being permanently deleted.', {
        status: result.job.status,
      });
    }

    return successResponse(res, 200, 'Job permanently deleted.', { jobId: result.jobId });
  } catch (error) {
    next(error);
  }
}

export async function getJobDetails(req, res, next) {
  try {
    const job = await jobService.getJobDetails(req.params.jobId);
    return successResponse(res, 200, 'Job details retrieved.', job);
  } catch (error) {
    next(error);
  }
}

export async function listJobs(req, res, next) {
  try {
    const result = await jobService.listJobs(req.query);
    return successResponse(res, 200, 'Jobs retrieved.', result);
  } catch (error) {
    next(error);
  }
}

export async function getMyJobs(req, res, next) {
  try {
    const jobs = await jobService.getMyJobs(req.user.userId);
    return successResponse(res, 200, 'Your jobs retrieved.', jobs);
  } catch (error) {
    next(error);
  }
}

export async function generateJobMatch(req, res, next) {
  try {
    const match = await jobMatchService.generateOrGetJobMatchForStudent(req.user.userId, req.params.jobId);
    return successResponse(res, 200, 'Job match retrieved.', match);
  } catch (error) {
    next(error);
  }
}

export async function getJobMatch(req, res, next) {
  try {
    const match = await jobMatchService.getJobMatchForStudent(req.user.userId, req.params.jobId);
    return successResponse(res, 200, 'Job match retrieved.', match);
  } catch (error) {
    next(error);
  }
}
