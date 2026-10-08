/**
 * 404 handler for unmatched /api routes (Express 5 disallows '*' wildcards,
 * so this is mounted at the /api level in server.js).
 */
export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

/**
 * Central error handler. Express 5 forwards rejected promises from async
 * handlers here automatically — just throw (or set err.statusCode for 4xx).
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  // Mongoose validation errors → 400 with a readable message.
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {})
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ success: false, message: message || err.message });
  }

  // Bad ObjectId casts → 400.
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }

  // Duplicate key (unique index) → 409.
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res
      .status(409)
      .json({ success: false, message: `Duplicate value for ${field}` });
  }

  if (status >= 500) console.error('[error]', err);

  res.status(status).json({ success: false, message: err.message || 'Server error' });
}
