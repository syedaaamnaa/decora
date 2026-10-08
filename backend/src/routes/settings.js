import { Router } from 'express';

import SiteSettings from '../models/SiteSettings.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/** GET /api/settings — public site settings (null until first saved). */
router.get('/', async (req, res) => {
  const data = await SiteSettings.findOne({ key: 'site' });
  res.json({ success: true, data });
});

/** PUT /api/settings — upsert the singleton settings document. */
router.put('/', protect, async (req, res) => {
  const data = await SiteSettings.findOneAndUpdate(
    { key: 'site' },
    { $set: req.body },
    { upsert: true, new: true, runValidators: true }
  );
  res.json({ success: true, data, message: 'Settings saved' });
});

export default router;
