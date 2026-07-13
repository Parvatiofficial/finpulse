const reqMap = new Map();

module.exports = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 150;

  if (!reqMap.has(ip)) {
    reqMap.set(ip, { count: 1, startTime: now });
    return next();
  }

  const rec = reqMap.get(ip);
  if (now - rec.startTime > windowMs) {
    rec.count = 1;
    rec.startTime = now;
    return next();
  }

  rec.count += 1;
  if (rec.count > max) {
    return res.status(429).json({ success: false, error: 'Rate limit exceeded on treasury gateway.' });
  }
  next();
};
