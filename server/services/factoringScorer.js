const { FACTORING_TIERS } = require('../config/currencies');

/**
 * Dynamic credit risk scoring & advance rate computation for invoice factoring
 */
exports.evaluateInvoice = ({ totalAmount, debtorBusiness, dueDate, issueDate }) => {
  const daysToDue = Math.max(1, Math.round((new Date(dueDate) - new Date(issueDate)) / (1000 * 60 * 60 * 24)));

  // Base score
  let score = 85;

  // Penalize long payment terms (>60 days)
  if (daysToDue > 90) score -= 20;
  else if (daysToDue > 60) score -= 10;

  // Penalize high single-invoice concentration
  if (totalAmount > 100000) score -= 10;

  score = Math.max(10, Math.min(99, score));

  // Determine tier
  let tier = 'TIER_C';
  let config = FACTORING_TIERS.TIER_C;
  if (score >= FACTORING_TIERS.TIER_A.minScore) {
    tier = 'TIER_A';
    config = FACTORING_TIERS.TIER_A;
  } else if (score >= FACTORING_TIERS.TIER_B.minScore) {
    tier = 'TIER_B';
    config = FACTORING_TIERS.TIER_B;
  }

  const advanceRate = config.advanceRate;
  const factoringFee = Number((totalAmount * config.feeRate).toFixed(2));
  const fundedAmount = Number((totalAmount * advanceRate - factoringFee).toFixed(2));

  return {
    riskScore: score,
    tier,
    advanceRate,
    factoringFee,
    fundedAmount,
    eligible: score >= 50
  };
};
