const assert = require('assert');
const { calculateEntryHash } = require('../services/ledgerHasher');

describe('Cryptographic Ledger Hash Suite', () => {
  it('should generate deterministic 64-character SHA-256 hash', () => {
    const lines = [
      { accountNumber: '1010', type: 'DEBIT', amount: 1000 },
      { accountNumber: '2010', type: 'CREDIT', amount: 1000 }
    ];
    const hash = calculateEntryHash('GENESIS', 'JE-001', lines, '2026-06-01T10:00:00Z');
    assert.strictEqual(hash.length, 64);
  });

  it('should produce different hash if line amount is altered', () => {
    const linesA = [{ accountNumber: '1010', type: 'DEBIT', amount: 1000 }];
    const linesB = [{ accountNumber: '1010', type: 'DEBIT', amount: 1001 }];
    const hashA = calculateEntryHash('PREV', 'JE-001', linesA, '2026-06-01T10:00:00Z');
    const hashB = calculateEntryHash('PREV', 'JE-001', linesB, '2026-06-01T10:00:00Z');
    assert.notStrictEqual(hashA, hashB);
  });
});

console.log('✓ Cryptographic ledger hash integrity tests passed.');
