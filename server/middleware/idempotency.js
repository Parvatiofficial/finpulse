const idempotencyStore = new Map();

/**
 * Prevents duplicate transaction debit execution using Idempotency-Key header
 */
module.exports = (req, res, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) return next();

  const key = req.headers['idempotency-key'];
  if (!key) return next();

  if (idempotencyStore.has(key)) {
    const cached = idempotencyStore.get(key);
    res.setHeader('X-Cache-Lookup', 'IDEMPOTENT_REPLAY');
    return res.status(cached.statusCode).json(cached.body);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyStore.set(key, { statusCode: res.statusCode, body });
      // Clean after 24 hours
      setTimeout(() => idempotencyStore.delete(key), 86400 * 1000).unref();
    }
    return originalJson(body);
  };

  next();
};
