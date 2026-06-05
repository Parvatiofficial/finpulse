const mongoose = require('mongoose');

const journalLineSchema = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
  type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  amount: { type: Number, required: true, min: [0.01, 'Amount must be positive'] }
});

const journalEntrySchema = new mongoose.Schema(
  {
    entryNumber: { type: String, required: true, unique: true },
    description: { type: String, required: true, trim: true },
    referenceId: { type: String, default: null },
    currency: { type: String, default: 'USD' },
    lines: [journalLineSchema],
    prevHash: { type: String, default: 'GENESIS' },
    hash: { type: String, required: true },
    postedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

// Strict Double-Entry Invariant: Debits MUST equal Credits
journalEntrySchema.pre('validate', function (next) {
  let totalDebit = 0;
  let totalCredit = 0;

  if (!this.lines || this.lines.length < 2) {
    return next(new Error('Journal entry must contain at least 2 balanced line items'));
  }

  this.lines.forEach((line) => {
    if (line.type === 'DEBIT') totalDebit += Number(line.amount);
    if (line.type === 'CREDIT') totalCredit += Number(line.amount);
  });

  const diff = Math.abs(totalDebit - totalCredit);
  if (diff > 0.001) {
    return next(new Error(`Double-entry balance violation: Debits ($${totalDebit.toFixed(2)}) must equal Credits ($${totalCredit.toFixed(2)})`));
  }
  next();
});

journalEntrySchema.index({ entryNumber: 1, postedAt: -1 });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
