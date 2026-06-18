const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const idempotency = require('./middleware/idempotency');
const auditLogger = require('./middleware/auditLogger');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(idempotency);
app.use(auditLogger);

app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'FinPulse Core Treasury Engine',
    status: 'operational',
    ledgerHash: 'SHA256_ACTIVE',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/ledger', require('./routes/ledgerRoutes'));
app.use('/api/v1/wallets', require('./routes/walletRoutes'));
app.use('/api/v1/reconciliation', require('./routes/reconciliationRoutes'));
app.use('/api/v1/factoring', require('./routes/factoringRoutes'));
app.use('/api/v1/treasury', require('./routes/treasuryRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5006;
if (process.env.NODE_ENV !== 'test') {
  connectDB();
  app.listen(PORT, () => console.log(`[FinPulse Treasury Engine] running on http://localhost:${PORT}`));
}

module.exports = app;
