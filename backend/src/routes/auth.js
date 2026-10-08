import { Router } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/** POST /api/auth/login — exchange credentials for a JWT. */
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select(
    '+password'
  );

  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const payload = { id: user._id, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  });
});

/** GET /api/auth/me — current authenticated user. */
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  res.json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export default router;
