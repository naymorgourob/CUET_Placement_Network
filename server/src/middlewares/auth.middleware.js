import { verifyToken } from '../utils/generateToken.js';
import { AppError } from '../utils/AppError.js';
import db from '../models/index.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication token is missing.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await db.User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid or expired token.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError(401, 'Invalid or expired token.'));
  }
}
