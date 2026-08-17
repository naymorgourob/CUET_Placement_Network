import { errorResponse } from '../utils/apiResponse.js';

export function notFound(req, res) {
  return errorResponse(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}
