import { Router } from 'express';

import Project from '../models/Project.js';
import Product from '../models/Product.js';
import Client from '../models/Client.js';
import Testimonial from '../models/Testimonial.js';
import ContactMessage from '../models/ContactMessage.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/** GET /api/stats — dashboard counters (admin only). */
router.get('/', protect, async (req, res) => {
  const [projects, products, clients, testimonials, leads, newLeads] =
    await Promise.all([
      Project.countDocuments(),
      Product.countDocuments(),
      Client.countDocuments(),
      Testimonial.countDocuments(),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'new' }),
    ]);

  res.json({
    success: true,
    data: { projects, products, clients, testimonials, leads, newLeads },
  });
});

export default router;
