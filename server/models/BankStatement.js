const mongoose = require('mongoose');
const { RECONCILIATION_STATUS, SUPPORTED_CURRENCIES } = require('../config/currencies');

const bankStatementSchema = new mongoose.Schema(
  {
    statementId: { type: String, required: true, unique: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    transactionDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, enum: SUPPORTED_CURRENCIES, default: 'USD' },
    reference: { type: String, required: true, trim: true },
    counterparty: { type: String, required: true, trim: true },
    status: { type: String, enum: RECONCILIATION_STATUS, default: 'UNMATCHED' },
    matchedEntryId: { type: mongoose.Schema.Types.ObjectId, ref: 'JournalEntry', default: null }
  },
  {
    timestamps: true
  }
);

bankStatementSchema.index({ status: 1, transactionDate: -1 });
bankStatementSchema.index({ reference: 'text', counterparty: 'text' });

module.exports = mongoose.model('BankStatement', bankStatementSchema);
