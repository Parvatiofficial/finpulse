module.exports = {
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'INR', 'SGD'],
  ACCOUNT_TYPES: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'],
  FACTORING_STATUS: ['SUBMITTED', 'UNDERWRITING', 'APPROVED', 'DISBURSED', 'SETTLED', 'REJECTED'],
  RECONCILIATION_STATUS: ['UNMATCHED', 'PROBABLE_MATCH', 'RECONCILED', 'DISPUTED'],
  FACTORING_TIERS: {
    TIER_A: { minScore: 85, advanceRate: 0.90, feeRate: 0.015 },
    TIER_B: { minScore: 70, advanceRate: 0.80, feeRate: 0.025 },
    TIER_C: { minScore: 50, advanceRate: 0.70, feeRate: 0.040 }
  }
};
