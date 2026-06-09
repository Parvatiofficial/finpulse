const assert = require('assert');
const JournalEntry = require('../models/JournalEntry');

describe('Double-Entry Balance Invariant Suite', () => {
  it('should reject journal entries where debits do not equal credits', () => {
    const entry = new JournalEntry({
      entryNumber: 'JE-TEST-01',
      description: 'Unbalanced transfer',
      lines: [
        { account: '507f1f77bcf86cd799439011', accountNumber: '1010', accountName: 'Cash', type: 'DEBIT', amount: 500 },
        { account: '507f1f77bcf86cd799439012', accountNumber: '2010', accountName: 'Payable', type: 'CREDIT', amount: 450 }
      ],
      hash: 'samplehash'
    });
    const err = entry.validateSync();
    assert.ok(err, 'Expected balance validation failure');
    assert.ok(err.message.includes('Double-entry balance violation'));
  });

  it('should pass validation when total debits strictly equal total credits', () => {
    const entry = new JournalEntry({
      entryNumber: 'JE-TEST-02',
      description: 'Balanced transfer',
      lines: [
        { account: '507f1f77bcf86cd799439011', accountNumber: '1010', accountName: 'Cash', type: 'DEBIT', amount: 500 },
        { account: '507f1f77bcf86cd799439012', accountNumber: '2010', accountName: 'Payable', type: 'CREDIT', amount: 500 }
      ],
      hash: 'samplehash'
    });
    const err = entry.validateSync();
    assert.strictEqual(err, undefined);
  });
});

console.log('✓ Double-entry debit/credit invariant tests passed.');
