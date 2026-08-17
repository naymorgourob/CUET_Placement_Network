import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/AppError.js';

const RESUME_UPLOAD_DIR = path.join(process.env.UPLOAD_PATH || 'uploads', 'resumes');
const COMPANY_LOGO_UPLOAD_DIR = path.join(process.env.UPLOAD_PATH || 'uploads', 'companies');
const MAX_FILE_SIZE_BYTES = Number(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024;
const ALLOWED_LOGO_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);
const ALLOWED_LOGO_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, RESUME_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

function fileFilter(req, file, cb) {
  const isPdf =
    file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf';

  if (!isPdf) {
    return cb(new AppError(400, 'Only PDF files are allowed for resume upload.'));
  }

  cb(null, true);
}

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, COMPANY_LOGO_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  },
});

function logoFileFilter(req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  const isAllowed = ALLOWED_LOGO_MIME_TYPES.has(file.mimetype) && ALLOWED_LOGO_EXTENSIONS.has(extension);

  if (!isAllowed) {
    return cb(new AppError(400, 'Only PNG, JPEG, WEBP, or SVG images are allowed for the company logo.'));
  }

  cb(null, true);
}

export const uploadCompanyLogo = multer({
  storage: logoStorage,
  fileFilter: logoFileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});
