import { Router } from 'express';

import Content from '../models/Content.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/content — public.
 * Returns every saved section as a single map: { [key]: data }.
 * Sections the admin has never touched are simply absent — the frontend
 * merges this over its bundled defaults, so the site always renders.
 */
router.get('/', async (req, res) => {
  const docs = await Content.find({}).select('key data');
  const map = {};
  for (const doc of docs) map[doc.key] = doc.data;
  res.json({ success: true, data: map });
});

/** GET /api/content/:key — public single section (null when not saved yet). */
router.get('/:key', async (req, res) => {
  const doc = await Content.findOne({ key: req.params.key }).select('key data');
  res.json({ success: true, data: doc ? doc.data : null });
});

/** PUT /api/content/:key — upsert a section (admin only). */
router.put('/:key', protect, async (req, res) => {
  const key = String(req.params.key || '').trim();
  if (!key) {
    const err = new Error('A content key is required');
    err.statusCode = 400;
    throw err;
  }

  // Accept either the raw value or an { data } envelope.
  const body = req.body;
  const data =
    body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')
      ? body.data
      : body;

  const doc = await Content.findOneAndUpdate(
    { key },
    { $set: { data } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, data: doc.data, message: 'Content saved' });
});

/** DELETE /api/content/:key — remove an override so the section falls back to defaults. */
router.delete('/:key', protect, async (req, res) => {
  await Content.deleteOne({ key: req.params.key });
  res.json({ success: true, message: 'Content reset to default' });
});

export default router;
