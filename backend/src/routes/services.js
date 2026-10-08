import { Router } from 'express';
import mongoose from 'mongoose';

import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js';
import { searchRegex } from '../utils/search.js';

const router = Router();

/** GET /api/services — public list. Query: search. */
router.get('/', async (req, res) => {
  const filter = {};
  const rx = searchRegex(req.query.search);
  if (rx) filter.$or = [{ title: rx }, { description: rx }];

  const data = await Service.find(filter).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data });
});

/** GET /api/services/:id — single service. */
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Service.findById(req.params.id);
  if (!doc) {
    const err = new Error('Service not found');
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: doc });
});

/** POST /api/services — create. */
router.post('/', protect, async (req, res) => {
  const doc = await Service.create(req.body);
  res.status(201).json({ success: true, data: doc, message: 'Service created' });
});

/** PUT /api/services/:id — update. */
router.put('/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Service.findById(req.params.id);
  if (!doc) {
    const err = new Error('Service not found');
    err.statusCode = 404;
    throw err;
  }

  const { _id, __v, createdAt, ...updates } = req.body;
  Object.assign(doc, updates);
  await doc.save(); // pre('validate') regenerates the slug when the title changed

  res.json({ success: true, data: doc, message: 'Service updated' });
});

/** DELETE /api/services/:id */
router.delete('/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Service.findByIdAndDelete(req.params.id);
  if (!doc) {
    const err = new Error('Service not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, message: 'Service deleted' });
});

export default router;
