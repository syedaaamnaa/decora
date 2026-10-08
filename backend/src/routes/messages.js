import { Router } from 'express';
import mongoose from 'mongoose';

import ContactMessage from '../models/ContactMessage.js';
import { protect } from '../middleware/auth.js';
import { searchRegex } from '../utils/search.js';

const router = Router();

/** POST /api/messages — public contact form submission. */
router.post('/', async (req, res) => {
  const { name, email, phone, service, message } = req.body || {};

  const missing = ['name', 'email', 'message'].filter((f) => !req.body?.[f]);
  if (missing.length) {
    const err = new Error(`Missing required fields: ${missing.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  const doc = await ContactMessage.create({ name, email, phone, service, message });
  res.status(201).json({ success: true, data: doc, message: 'Message received' });
});

/** GET /api/messages — admin list. Query: search, status. */
router.get('/', protect, async (req, res) => {
  const filter = {};

  if (req.query.status) filter.status = req.query.status;

  const rx = searchRegex(req.query.search);
  if (rx) filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { message: rx }];

  const data = await ContactMessage.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data });
});

/** PATCH /api/messages/:id — update status (new / read / archived). */
router.patch('/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const { status } = req.body || {};
  if (!['new', 'read', 'archived'].includes(status)) {
    const err = new Error("Status must be one of: 'new', 'read', 'archived'");
    err.statusCode = 400;
    throw err;
  }

  const doc = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!doc) {
    const err = new Error('Message not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, data: doc, message: 'Message updated' });
});

/** DELETE /api/messages/:id */
router.delete('/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!doc) {
    const err = new Error('Message not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, message: 'Message deleted' });
});

export default router;
