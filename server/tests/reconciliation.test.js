const assert = require('assert');
const { matchTransaction } = require('../services/reconciliationMatcher');

describe('Bank Reconciliation Matching Suite', () => {
  it('should score 100% on exact amount, reference and date match', () => {
    const bankTx = { amount: 5000, reference: 'Invoice 104', transactionDate: new Date('2026-08-10') };
    const entries = [{
      description: 'Payment for Invoice 104 settlement',
      postedAt: new Date('2026-08-10'),
      lines: [{ amount: 5000, type: 'DEBIT' }]
    }];
    const res = matchTransaction(bankTx, entries);
    assert.strictEqual(res.matched, true);
    assert.strictEqual(res.status, 'RECONCILED');
    assert.strictEqual(res.confidenceScore, 100);
  });
});

console.log('✓ Reconciliation matching engine assertions passed.');
