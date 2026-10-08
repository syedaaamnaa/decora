import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

// Create the uploads directory if it does not exist yet.
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.avif',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB per file
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.has(ext)) return cb(null, true);
    cb(new Error(`Unsupported file type: ${ext}`));
  },
});

/**
 * Maps multer's `req.files` onto `req.body` so create/update endpoints can
 * accept either JSON or multipart/form-data without caring which was used.
 */
function normalizeFiles(req, res, next) {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return next();
  }

  const url = (f) => `/uploads/${f.filename}`;

  // Stable ordering: first by original fieldname order, then by original filename.
  const ordered = [...req.files].sort((a, b) => {
    if (a.fieldname !== b.fieldname) return a.fieldname.localeCompare(b.fieldname);
    return String(a.originalname).localeCompare(String(b.originalname));
  });

  for (const file of ordered) {
    switch (file.fieldname) {
      case 'images': {
        const current = Array.isArray(req.body.images) ? req.body.images : [];
        req.body.images = [...current, url(file)];
        break;
      }
      case 'image':
        req.body.image = url(file);
        break;
      case 'logo':
        req.body.logo = url(file);
        break;
      case 'avatar':
        req.body.avatar = url(file);
        break;
      case 'cover':
        req.body.cover = url(file);
        break;
      default:
        break;
    }
  }

  next();
}

/** Middleware accepting any multipart fields, then normalizing into req.body. */
const uploadAny = [upload.any(), normalizeFiles];

export { upload, uploadAny };
