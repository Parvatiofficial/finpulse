const crypto = require('crypto');

/**
 * Calculates SHA-256 cryptographic chain hash for tamper-evident ledger integrity
 */
exports.calculateEntryHash = (prevHash, entryNumber, lines, postedAt) => {
  const serializedLines = lines
    .map((l) => `${l.accountNumber}:${l.type}:${Number(l.amount).toFixed(2)}`)
    .sort()
    .join('|');

  const payload = `${prevHash}|${entryNumber}|${serializedLines}|${new Date(postedAt).toISOString()}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
};
