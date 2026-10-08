import { Router } from 'express';
import mongoose from 'mongoose';

import Client from '../models/Client.js';
import { protect } from '../middleware/auth.js';
import { uploadAny } from '../middleware/upload.js';
import { searchRegex } from '../utils/search.js';

const router = Router();

/** GET /api/clients — public list. Query: search. */
router.get('/', async (req, res) => {
  const filter = {};
  const rx = searchRegex(req.query.search);
  if (rx) filter.$or = [{ name: rx }, { industry: rx }];

  const data = await Client.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data });
});

/** GET /api/clients/:id — single client. */
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Client.findById(req.params.id);
  if (!doc) {
    const err = new Error('Client not found');
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: doc });
});

/** POST /api/clients — create (JSON or multipart with a `logo` file). */
router.post('/', protect, uploadAny, async (req, res) => {
  const doc = await Client.create(req.body);
  res.status(201).json({ success: true, data: doc, message: 'Client created' });
});

/** PUT /api/clients/:id — update. */
router.put('/:id', protect, uploadAny, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Client.findById(req.params.id);
  if (!doc) {
    const err = new Error('Client not found');
    err.statusCode = 404;
    throw err;
  }

  const { _id, __v, createdAt, ...updates } = req.body;
  Object.assign(doc, updates);
  await doc.save();

  res.json({ success: true, data: doc, message: 'Client updated' });
});

/** DELETE /api/clients/:id */
router.delete('/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Client.findByIdAndDelete(req.params.id);
  if (!doc) {
    const err = new Error('Client not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, message: 'Client deleted' });
});

export default router;
