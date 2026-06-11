module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Financial System Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'record';
    message = `Duplicate resource: A record with that ${field} already exists.`;
  }

  console.error(`[FinPulse Error] [${req.method}] ${req.originalUrl} - ${statusCode}: ${message}`);
  res.status(statusCode).json({ success: false, error: message });
};
