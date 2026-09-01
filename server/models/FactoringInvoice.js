const mongoose = require('mongoose');
const { FACTORING_STATUS, SUPPORTED_CURRENCIES } = require('../config/currencies');

const factoringInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    issuerBusiness: { type: String, required: true, trim: true },
    debtorBusiness: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true, min: 100 },
    currency: { type: String, required: true, enum: SUPPORTED_CURRENCIES, default: 'USD' },
    riskScore: { type: Number, min: 0, max: 100, default: 75 },
    advanceRate: { type: Number, default: 0.80 },
    factoringFee: { type: Number, default: 0 },
    fundedAmount: { type: Number, default: 0 },
    status: { type: String, enum: FACTORING_STATUS, default: 'SUBMITTED' }
  },
  {
    timestamps: true
  }
);

factoringInvoiceSchema.index({ issuerBusiness: 1, status: 1 });
factoringInvoiceSchema.index({ dueDate: 1 });

module.exports = mongoose.model('FactoringInvoice', factoringInvoiceSchema);
