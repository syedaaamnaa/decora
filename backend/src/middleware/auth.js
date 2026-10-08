import jwt from 'jsonwebtoken';

/**
 * Verifies the `Authorization: Bearer <token>` header and attaches
 * `req.user = { id, email, role }` for downstream handlers.
 */
export function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    const err = new Error('Not authorized, no token provided');
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    return next();
  } catch {
    const err = new Error('Not authorized, token invalid or expired');
    err.statusCode = 401;
    return next(err);
  }
}
