import { Router } from 'express';
import mongoose from 'mongoose';

import Testimonial from '../models/Testimonial.js';
import { protect } from '../middleware/auth.js';
import { uploadAny } from '../middleware/upload.js';
import { searchRegex } from '../utils/search.js';

const router = Router();

/** GET /api/testimonials — public list. Query: featured, search. */
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.featured === 'true') filter.featured = true;

  const rx = searchRegex(req.query.search);
  if (rx) filter.$or = [{ name: rx }, { company: rx }, { text: rx }];

  const data = await Testimonial.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data });
});

/** GET /api/testimonials/:id — single testimonial. */
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Testimonial.findById(req.params.id);
  if (!doc) {
    const err = new Error('Testimonial not found');
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: doc });
});

/** POST /api/testimonials — create (JSON or multipart with an `avatar` file). */
router.post('/', protect, uploadAny, async (req, res) => {
  const doc = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: doc, message: 'Testimonial created' });
});

/** PUT /api/testimonials/:id — update. */
router.put('/:id', protect, uploadAny, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Testimonial.findById(req.params.id);
  if (!doc) {
    const err = new Error('Testimonial not found');
    err.statusCode = 404;
    throw err;
  }

  const { _id, __v, createdAt, ...updates } = req.body;
  Object.assign(doc, updates);
  await doc.save();

  res.json({ success: true, data: doc, message: 'Testimonial updated' });
});

/** DELETE /api/testimonials/:id */
router.delete('/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Testimonial.findByIdAndDelete(req.params.id);
  if (!doc) {
    const err = new Error('Testimonial not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, message: 'Testimonial deleted' });
});

export default router;
