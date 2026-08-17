import { MulterError } from 'multer';
import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import { AppError } from '../utils/AppError.js';
import { errorResponse } from '../utils/apiResponse.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.message);
  }

  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return errorResponse(res, 400, 'Malformed JSON in request body.');
  }

  if (err instanceof MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `File is too large. Maximum allowed size is ${process.env.MAX_FILE_SIZE_MB || 5}MB.`
        : err.message;
    return errorResponse(res, 400, message);
  }

  if (err instanceof UniqueConstraintError) {
    const errors = err.errors.map((item) => ({ field: item.path, message: 'This value already exists.' }));
    return errorResponse(res, 409, 'A record with the given value already exists.', errors);
  }

  if (err instanceof ValidationError) {
    const errors = err.errors.map((item) => ({ field: item.path, message: item.message }));
    return errorResponse(res, 400, 'Validation failed.', errors);
  }

  if (err instanceof ForeignKeyConstraintError) {
    return errorResponse(res, 400, 'Invalid reference to a related resource.');
  }

  console.error(err);
  return errorResponse(res, 500, 'Internal server error.');
}
