/**
 * Bank statement smart reconciliation matching algorithm
 */
exports.matchTransaction = (bankTx, journalEntries = []) => {
  let bestMatch = null;
  let highestScore = 0;

  for (const entry of journalEntries) {
    let score = 0;

    // 1. Amount match (Exact match = 50 pts)
    const matchingLine = entry.lines.find((l) => Math.abs(l.amount - Math.abs(bankTx.amount)) < 0.01);
    if (matchingLine) score += 50;

    // 2. Reference match (Exact or contains = 30 pts)
    const refClean = (bankTx.reference || '').toLowerCase();
    const entryDesc = (entry.description || '').toLowerCase();
    if (refClean && entryDesc.includes(refClean)) score += 30;

    // 3. Date proximity within 3 days = 20 pts
    const txDate = new Date(bankTx.transactionDate).getTime();
    const entryDate = new Date(entry.postedAt).getTime();
    const daysDiff = Math.abs(txDate - entryDate) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 3) score += 20;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  return {
    matched: highestScore >= 70,
    confidenceScore: highestScore,
    matchedEntry: highestScore >= 70 ? bestMatch : null,
    status: highestScore >= 80 ? 'RECONCILED' : highestScore >= 60 ? 'PROBABLE_MATCH' : 'UNMATCHED'
  };
};
