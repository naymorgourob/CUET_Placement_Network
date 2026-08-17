import * as savedJobService from '../services/savedJob.service.js';
import { successResponse } from '../utils/apiResponse.js';

export async function saveJob(req, res, next) {
  try {
    await savedJobService.saveJob(req.user.userId, req.params.jobId);
    return successResponse(res, 201, 'Job saved.');
  } catch (error) {
    next(error);
  }
}

export async function unsaveJob(req, res, next) {
  try {
    await savedJobService.unsaveJob(req.user.userId, req.params.jobId);
    return successResponse(res, 200, 'Job removed from saved jobs.');
  } catch (error) {
    next(error);
  }
}

export async function getMySavedJobs(req, res, next) {
  try {
    const savedJobs = await savedJobService.listSavedJobs(req.user.userId);
    return successResponse(res, 200, 'Saved jobs retrieved.', savedJobs);
  } catch (error) {
    next(error);
  }
}

export async function getMySavedJobIds(req, res, next) {
  try {
    const jobIds = await savedJobService.getSavedJobIds(req.user.userId);
    return successResponse(res, 200, 'Saved job IDs retrieved.', jobIds);
  } catch (error) {
    next(error);
  }
}
