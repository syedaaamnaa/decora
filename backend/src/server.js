import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB, dbState } from './config/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure the uploads directory exists before any file can be written to it.
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Allow comma-separated origins from CORS_ORIGIN, or fall back to any origin.
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  : true;
app.use(cors({ origin: corsOrigins, credentials: true }));

app.use(express.json({ limit: '3mb' }));

// Serve uploaded files (project images, logos, avatars...).
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check.
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', db: dbState.isConnected });
});

// All feature routers.
app.use('/api', routes);

// 404 for unmatched /api routes (Express 5 has no '*' wildcard).
app.use('/api', notFound);

// Central error handler — every thrown/rejected error lands here.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start the server even if MongoDB is unreachable; DB-dependent routes
// will simply error until the connection is restored.
try {
  await connectDB();
} catch {
  console.warn('\n*** WARNING: starting WITHOUT a database connection. ***\n');
}

app.listen(PORT, () => {
  console.log(`[server] DECORA API listening on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception:', err);
});
