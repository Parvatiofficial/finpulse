import React from 'react';

const Navbar = ({ activeTab, setActiveTab, onOpenTransfer, onOpenFactoring }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <span className="brand-logo">⚡</span>
          <div>
            <span className="brand-name">FinPulse</span>
            <span className="brand-badge">Treasury & Ledger Core</span>
          </div>
        </div>

        <nav className="nav-links">
          <button className={`nav-btn ${activeTab === 'treasury' ? 'active' : ''}`} onClick={() => setActiveTab('treasury')}>
            📊 Treasury Overview
          </button>
          <button className={`nav-btn ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>
            📑 Double-Entry Ledger
          </button>
          <button className={`nav-btn ${activeTab === 'reconciliation' ? 'active' : ''}`} onClick={() => setActiveTab('reconciliation')}>
            🔄 Bank Reconciliation
          </button>
          <button className={`nav-btn ${activeTab === 'factoring' ? 'active' : ''}`} onClick={() => setActiveTab('factoring')}>
            💳 Invoice Factoring
          </button>
        </nav>

        <div className="nav-actions">
          <button className="btn-secondary-sm" onClick={onOpenTransfer}>+ Transfer Funds</button>
          <button className="btn-primary-sm" onClick={onOpenFactoring}>+ Factor Invoice</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
