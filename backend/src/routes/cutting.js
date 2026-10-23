import { Router } from 'express';
import mongoose from 'mongoose';

import CuttingPlan from '../models/CuttingPlan.js';
import CuttingDraft from '../models/CuttingDraft.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/* Every cutting route is workshop-private. */
router.use(protect);

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function notFound(message) {
  const err = new Error(message);
  err.statusCode = 404;
  return err;
}

function ensureId(id) {
  if (!mongoose.isValidObjectId(id)) throw badRequest('Invalid cutting plan id');
}

/** Keep only the fields the plan schema owns; ignore client timestamps/ids. */
function planPayload(body = {}) {
  const settings = body.settings || {};
  return {
    title: body.title ?? '',
    customerName: body.customerName ?? '',
    settings: {
      kerf: Number(settings.kerf) || 0,
      edgeMargin: Number(settings.edgeMargin) || 0,
      pieceAllowance: Number(settings.pieceAllowance) || 0,
      unit: settings.unit || 'MM',
    },
    demand: Array.isArray(body.demand) ? body.demand : [],
    stock: Array.isArray(body.stock) ? body.stock : [],
    sheets: Array.isArray(body.sheets) ? body.sheets : [],
    statistics: body.statistics || {},
  };
}

/* ------------------------------- plan list ------------------------------- */

/** GET /api/cutting/plans — newest first, without the heavy layout payload. */
router.get('/plans', async (req, res) => {
  const data = await CuttingPlan.find()
    .select('-sheets -demand -stock')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, data });
});

/** GET /api/cutting/plans/:id — full plan including sheets. */
router.get('/plans/:id', async (req, res) => {
  ensureId(req.params.id);
  const doc = await CuttingPlan.findById(req.params.id);
  if (!doc) throw notFound('Cutting plan not found');
  res.json({ success: true, data: doc });
});

/** POST /api/cutting/plans — persist a freshly optimized plan. */
router.post('/plans', async (req, res) => {
  const payload = planPayload(req.body);
  if (payload.demand.length === 0 || payload.stock.length === 0) {
    throw badRequest('A cutting plan needs at least one demand piece and one stock sheet');
  }
  if (payload.sheets.length === 0) {
    throw badRequest('Run the optimizer before saving a cutting plan');
  }

  const last = await CuttingPlan.findOne().sort({ planNumber: -1 }).select('planNumber').lean();
  const planNumber = (last?.planNumber || 0) + 1;

  const doc = await CuttingPlan.create({ ...payload, planNumber, status: 'DRAFT' });
  res.status(201).json({ success: true, data: doc, message: `Plan #${planNumber} saved` });
});

/** PUT /api/cutting/plans/:id — replace inputs and computed layout. */
router.put('/plans/:id', async (req, res) => {
  ensureId(req.params.id);
  const doc = await CuttingPlan.findById(req.params.id);
  if (!doc) throw notFound('Cutting plan not found');

  const payload = planPayload(req.body);
  if (payload.demand.length === 0 || payload.stock.length === 0) {
    throw badRequest('A cutting plan needs at least one demand piece and one stock sheet');
  }

  Object.assign(doc, payload);
  await doc.save();
  res.json({ success: true, data: doc, message: `Plan #${doc.planNumber} updated` });
});

/** PATCH /api/cutting/plans/:id/accept — lock the plan for the workshop. */
router.patch('/plans/:id/accept', async (req, res) => {
  ensureId(req.params.id);
  const doc = await CuttingPlan.findById(req.params.id);
  if (!doc) throw notFound('Cutting plan not found');
  if (doc.status === 'ACCEPTED') throw badRequest('This cutting plan has already been accepted');

  doc.status = 'ACCEPTED';
  doc.acceptedAt = new Date();
  await doc.save();
  res.json({ success: true, data: doc, message: `Plan #${doc.planNumber} accepted` });
});

/** DELETE /api/cutting/plans — clear the whole plan history. */
router.delete('/plans', async (req, res) => {
  const result = await CuttingPlan.deleteMany({});
  res.json({ success: true, message: `Deleted ${result.deletedCount} cutting plans` });
});

/** DELETE /api/cutting/plans/:id */
router.delete('/plans/:id', async (req, res) => {
  ensureId(req.params.id);
  const doc = await CuttingPlan.findByIdAndDelete(req.params.id);
  if (!doc) throw notFound('Cutting plan not found');
  res.json({ success: true, message: `Plan #${doc.planNumber} deleted` });
});

/* ------------------------------- draft ---------------------------------- */

/** GET /api/cutting/draft — the workshop's in-progress inputs. */
router.get('/draft', async (req, res) => {
  const doc = await CuttingDraft.findOne({ key: 'workshop' }).lean();
  res.json({ success: true, data: doc || null });
});

/** PUT /api/cutting/draft — autosave the current inputs. */
router.put('/draft', async (req, res) => {
  const body = req.body || {};
  if (!Array.isArray(body.demand) || !Array.isArray(body.stock)) {
    throw badRequest('Draft demand and stock must be arrays');
  }

  const settings = body.settings || {};
  const doc = await CuttingDraft.findOneAndUpdate(
    { key: 'workshop' },
    {
      $set: {
        customerName: body.customerName ?? '',
        title: body.title ?? '',
        settings: {
          kerf: String(settings.kerf ?? '3'),
          edgeMargin: String(settings.edgeMargin ?? '5'),
          pieceAllowance: String(settings.pieceAllowance ?? '0'),
        },
        demand: body.demand,
        stock: body.stock,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, data: doc });
});

/** DELETE /api/cutting/draft — start over. */
router.delete('/draft', async (req, res) => {
  await CuttingDraft.deleteOne({ key: 'workshop' });
  res.json({ success: true, message: 'Cutting draft cleared' });
});

export default router;
