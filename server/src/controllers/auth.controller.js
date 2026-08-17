import * as authService from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function register(req, res, next) {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return errorResponse(res, 400, 'fullName, email, password, and role are required.');
    }

    if (role !== 'student' && role !== 'recruiter') {
      return errorResponse(res, 400, 'role must be either "student" or "recruiter".');
    }

    const result =
      role === 'student'
        ? await authService.registerStudent({ fullName, email, password })
        : await authService.registerRecruiter({ fullName, email, password });

    return successResponse(res, 201, 'Registration successful.', result);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'email and password are required.');
    }

    const result = await authService.login({ email, password });

    return successResponse(res, 200, 'Login successful.', result);
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  return successResponse(res, 200, 'Logged out successfully.');
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user.userId, { currentPassword, newPassword });

    return successResponse(res, 200, 'Password changed successfully.');
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const summary = await authService.getCurrentUser(req.user);
    return successResponse(res, 200, 'Current user retrieved.', summary);
  } catch (error) {
    next(error);
  }
}
