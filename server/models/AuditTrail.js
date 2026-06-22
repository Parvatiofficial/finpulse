const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    actor: { type: String, default: 'system' },
    entity: { type: String, required: true },
    entityId: { type: String, default: null },
    ipAddress: { type: String, default: '127.0.0.1' },
    details: { type: Object, default: {} },
    timestamp: { type: Date, default: Date.now }
  },
  {
    timestamps: false
  }
);

auditTrailSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditTrail', auditTrailSchema);
