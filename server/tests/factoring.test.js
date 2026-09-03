const assert = require('assert');
const { evaluateInvoice } = require('../services/factoringScorer');

describe('Invoice Factoring Risk Engine Suite', () => {
  it('should assign Tier A (90% advance) for low-risk 30-day invoice', () => {
    const res = evaluateInvoice({
      totalAmount: 20000,
      debtorBusiness: 'Blue Chip Corp',
      issueDate: '2026-09-01',
      dueDate: '2026-10-01'
    });
    assert.strictEqual(res.tier, 'TIER_A');
    assert.strictEqual(res.advanceRate, 0.90);
    assert.strictEqual(res.eligible, true);
  });
});

console.log('✓ Invoice factoring credit scoring assertions passed.');
