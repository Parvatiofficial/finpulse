const mongoose = require('mongoose');
const { SUPPORTED_CURRENCIES } = require('../config/currencies');

const walletSchema = new mongoose.Schema(
  {
    walletId: { type: String, required: true, unique: true, uppercase: true },
    businessName: { type: String, required: true, trim: true },
    ownerEmail: { type: String, required: true, lowercase: true, trim: true },
    currency: { type: String, required: true, enum: SUPPORTED_CURRENCIES, default: 'USD' },
    availableBalance: { type: Number, default: 0, min: 0 },
    lockedBalance: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['ACTIVE', 'FROZEN', 'PENDING_KYC'], default: 'ACTIVE' }
  },
  {
    timestamps: true
  }
);

walletSchema.index({ ownerEmail: 1, currency: 1 });

module.exports = mongoose.model('Wallet', walletSchema);
