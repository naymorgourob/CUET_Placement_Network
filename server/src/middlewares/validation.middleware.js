import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

export function validate(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return errorResponse(res, 400, 'Validation failed.', errors);
  }

  next();
}
