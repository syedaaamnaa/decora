import { Router } from 'express';
import mongoose from 'mongoose';

import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { uploadAny } from '../middleware/upload.js';
import { searchRegex } from '../utils/search.js';

const router = Router();

/** GET /api/products — public list. Query: featured, category, search. */
router.get('/', async (req, res) => {
  const filter = {};

  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.category) filter.category = req.query.category;

  const rx = searchRegex(req.query.search);
  if (rx) filter.$or = [{ title: rx }, { category: rx }];

  const data = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data });
});

/** GET /api/products/:idOrSlug — single product by ObjectId or slug. */
router.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;
  const query = mongoose.isValidObjectId(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug.toLowerCase() };

  const doc = await Product.findOne(query);
  if (!doc) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: doc });
});

/** POST /api/products — create (JSON or multipart/form-data). */
router.post('/', protect, uploadAny, async (req, res) => {
  const doc = await Product.create(req.body);
  res.status(201).json({ success: true, data: doc, message: 'Product created' });
});

/** PUT /api/products/:id — update. */
router.put('/:id', protect, uploadAny, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Product.findById(req.params.id);
  if (!doc) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  const { _id, __v, createdAt, ...updates } = req.body;
  Object.assign(doc, updates);
  await doc.save(); // pre('validate') regenerates the slug when the title changed

  res.json({ success: true, data: doc, message: 'Product updated' });
});

/** DELETE /api/products/:id */
router.delete('/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const doc = await Product.findByIdAndDelete(req.params.id);
  if (!doc) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, message: 'Product deleted' });
});

export default router;
