import { Router } from 'express';
import mongoose from 'mongoose';

import HeroSlide from '../models/HeroSlide.js';
import { protect } from '../middleware/auth.js';
import { uploadAny } from '../middleware/upload.js';

const router = Router();
const slideOrder = { order: 1, createdAt: 1 };

/** Public hero content contains only active slides in display order. */
router.get('/', async (req, res) => {
  const data = await HeroSlide.find({ active: true }).sort(slideOrder);
  res.json({ success: true, data });
});

/** Admin-only complete slide list. */
router.get('/admin', protect, async (req, res) => {
  const data = await HeroSlide.find().sort(slideOrder);
  res.json({ success: true, data });
});

router.post('/', protect, uploadAny, async (req, res) => {
  const doc = await HeroSlide.create(req.body);
  res.status(201).json({ success: true, data: doc, message: 'Hero slide created' });
});

router.patch('/reorder', protect, async (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids) || ids.some((id) => !mongoose.isValidObjectId(id))) {
    const err = new Error('A valid ordered list of slide ids is required');
    err.statusCode = 400;
    throw err;
  }

  const slides = await HeroSlide.find({ _id: { $in: ids } }).select('_id');
  if (slides.length !== ids.length || new Set(ids).size !== ids.length) {
    const err = new Error('The ordered list must contain each existing slide exactly once');
    err.statusCode = 400;
    throw err;
  }

  await HeroSlide.bulkWrite(
    ids.map((id, order) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }))
  );
  res.json({ success: true, message: 'Hero slides reordered' });
});

router.put('/:id', protect, uploadAny, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await HeroSlide.findById(req.params.id);
  if (!doc) {
    const err = new Error('Hero slide not found');
    err.statusCode = 404;
    throw err;
  }

  const { _id, __v, createdAt, updatedAt, ...updates } = req.body;
  Object.assign(doc, updates);
  await doc.save();
  res.json({ success: true, data: doc, message: 'Hero slide updated' });
});

router.delete('/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }
  const doc = await HeroSlide.findByIdAndDelete(req.params.id);
  if (!doc) {
    const err = new Error('Hero slide not found');
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, message: 'Hero slide deleted' });
});

export default router;
