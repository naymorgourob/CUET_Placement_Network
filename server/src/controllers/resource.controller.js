import * as resourceService from '../services/resource.service.js';
import { successResponse } from '../utils/apiResponse.js';

export async function listPublishedResources(req, res, next) {
  try {
    const result = await resourceService.listPublishedResources(req.query);
    return successResponse(res, 200, 'Resources retrieved.', result);
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedResource(req, res, next) {
  try {
    const resource = await resourceService.getFeaturedResource();
    return successResponse(res, 200, 'Featured resource retrieved.', resource);
  } catch (error) {
    next(error);
  }
}

export async function getResourceBySlug(req, res, next) {
  try {
    const resource = await resourceService.getPublishedResourceBySlug(req.params.slug);
    const related = await resourceService.getRelatedResources(resource);
    return successResponse(res, 200, 'Resource retrieved.', { resource, related });
  } catch (error) {
    next(error);
  }
}

// --- Admin management ---

export async function listAllResources(req, res, next) {
  try {
    const result = await resourceService.listAllResources(req.query);
    return successResponse(res, 200, 'Resources retrieved.', result);
  } catch (error) {
    next(error);
  }
}

export async function getResourceById(req, res, next) {
  try {
    const resource = await resourceService.getResourceById(req.params.resourceId);
    return successResponse(res, 200, 'Resource retrieved.', resource);
  } catch (error) {
    next(error);
  }
}

export async function createResource(req, res, next) {
  try {
    const resource = await resourceService.createResource(req.user.userId, req.body);
    return successResponse(res, 201, 'Resource created successfully.', resource);
  } catch (error) {
    next(error);
  }
}

export async function updateResource(req, res, next) {
  try {
    const resource = await resourceService.updateResource(req.params.resourceId, req.body);
    return successResponse(res, 200, 'Resource updated successfully.', resource);
  } catch (error) {
    next(error);
  }
}

export async function deleteResource(req, res, next) {
  try {
    const result = await resourceService.deleteResource(req.params.resourceId);
    return successResponse(res, 200, 'Resource deleted successfully.', result);
  } catch (error) {
    next(error);
  }
}
