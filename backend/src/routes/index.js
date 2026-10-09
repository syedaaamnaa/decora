import { Router } from 'express';

import authRouter from './auth.js';
import projectsRouter from './projects.js';
import productsRouter from './products.js';
import clientsRouter from './clients.js';
import testimonialsRouter from './testimonials.js';
import messagesRouter from './messages.js';
import servicesRouter from './services.js';
import settingsRouter from './settings.js';
import statsRouter from './stats.js';
import uploadsRouter from './uploads.js';
import heroSlidesRouter from './heroSlides.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/projects', projectsRouter);
router.use('/products', productsRouter);
router.use('/clients', clientsRouter);
router.use('/testimonials', testimonialsRouter);
router.use('/messages', messagesRouter);
router.use('/services', servicesRouter);
router.use('/settings', settingsRouter);
router.use('/stats', statsRouter);
router.use('/uploads', uploadsRouter);
router.use('/hero-slides', heroSlidesRouter);

export default router;
