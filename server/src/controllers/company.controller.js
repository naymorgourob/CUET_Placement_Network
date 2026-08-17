import * as companyService from '../services/company.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function listCompanies(req, res, next) {
  try {
    const result = await companyService.listCompanies(req.query);
    return successResponse(res, 200, 'Companies retrieved.', result);
  } catch (error) {
    next(error);
  }
}

export async function getCompanyById(req, res, next) {
  try {
    const company = await companyService.getCompanyById(req.params.companyId);
    return successResponse(res, 200, 'Company retrieved.', company);
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const company = await companyService.getCompany(req.user.userId);
    return successResponse(res, 200, 'Company profile retrieved.', company);
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const company = await companyService.createOrUpdateCompany(req.user.userId, req.body);
    return successResponse(res, 200, 'Company profile updated.', company);
  } catch (error) {
    next(error);
  }
}

export async function updateLogo(req, res, next) {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'A logo image file is required.');
    }

    const company = await companyService.updateCompanyLogo(req.user.userId, req.file);
    return successResponse(res, 200, 'Company logo updated.', company);
  } catch (error) {
    next(error);
  }
}
