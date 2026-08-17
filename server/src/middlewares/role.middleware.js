import { AppError } from '../utils/AppError.js';

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication is required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'You do not have permission to perform this action.'));
    }

    next();
  };
}
