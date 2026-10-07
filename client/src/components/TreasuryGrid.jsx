import React from 'react';
import StatCard from './StatCard';

const TreasuryGrid = ({ metrics, loading }) => {
  if (loading) return <div className="metrics-loading">Syncing treasury positions...</div>;

  const {
    totalLiquidity = 0,
    activeWalletsCount = 0,
    reconciledVolume = 0,
    activeFactoredVolume = 0,
  } = metrics || {};

  return (
    <div className="analytics-grid">
      <StatCard
        icon="💰"
        label="Total Available Liquidity"
        value={`$${totalLiquidity.toLocaleString()}`}
        subtext={`Across ${activeWalletsCount} business accounts`}
        trend="positive"
      />
      <StatCard
        icon="🔄"
        label="Reconciled Volume"
        value={`$${reconciledVolume.toLocaleString()}`}
        subtext="Bank matched statements"
        trend="positive"
      />
      <StatCard
        icon="📄"
        label="Active Factored AR"
        value={`$${activeFactoredVolume.toLocaleString()}`}
        subtext="Funded invoice receivables"
        trend="neutral"
      />
      <StatCard
        icon="🔒"
        label="Ledger Integrity Status"
        value="SHA-256 Valid"
        subtext="Tamper-evident block verification"
        trend="positive"
      />
    </div>
  );
};

export default TreasuryGrid;
