const mongoose = require('mongoose');
const { ACCOUNT_TYPES, SUPPORTED_CURRENCIES } = require('../config/currencies');

const accountSchema = new mongoose.Schema(
  {
    accountNumber: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ACCOUNT_TYPES },
    currency: { type: String, required: true, enum: SUPPORTED_CURRENCIES, default: 'USD' },
    balance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

accountSchema.index({ type: 1, currency: 1 });

module.exports = mongoose.model('Account', accountSchema);
