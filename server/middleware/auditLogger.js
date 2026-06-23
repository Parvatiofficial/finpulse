const AuditTrail = require('../models/AuditTrail');

module.exports = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const startTime = Date.now();
    const originalJson = res.json.bind(res);

    res.json = (body) => {
      AuditTrail.create({
        action: `${req.method} ${req.originalUrl}`,
        actor: req.headers['x-actor-email'] || 'system-treasury',
        entity: req.baseUrl.replace('/api/v1/', ''),
        entityId: req.params.id || (body && (body._id || (body.data && body.data._id))) || null,
        ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
        details: { statusCode: res.statusCode, latencyMs: Date.now() - startTime }
      }).catch((err) => console.error('[AuditTrail Error]:', err.message));

      return originalJson(body);
    };
  }
  next();
};
