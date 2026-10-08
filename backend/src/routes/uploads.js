import { Router } from 'express';

import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

/** POST /api/uploads — store a single file (`field: file`) and return its URL. */
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    const err = new Error('No file uploaded');
    err.statusCode = 400;
    throw err;
  }
  res.json({ success: true, data: { url: `/uploads/${req.file.filename}` } });
});

export default router;
