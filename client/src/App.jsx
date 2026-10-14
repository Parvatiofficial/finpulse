import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import TreasuryGrid from './components/TreasuryGrid';
import FilterBar from './components/FilterBar';
import LedgerTable from './components/LedgerTable';
import ReconciliationBoard from './components/ReconciliationBoard';
import TransferModal from './components/TransferModal';
import FactoringModal from './components/FactoringModal';
import {
  fetchTreasuryMetrics,
  fetchWallets,
  transferFunds,
  fetchJournalEntries,
  fetchBankStatements,
  runAutoReconciliation,
  fetchFactoringInvoices,
  submitFactoringInvoice
} from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('treasury');
  const [metrics, setMetrics] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [entries, setEntries] = useState([]);
  const [statements, setStatements] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isFactoringOpen, setIsFactoringOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [metricsRes, walletsRes, entriesRes, statementsRes, invoicesRes] = await Promise.all([
        fetchTreasuryMetrics(),
        fetchWallets(),
        fetchJournalEntries(),
        fetchBankStatements(),
        fetchFactoringInvoices()
      ]);
      setMetrics(metricsRes.data || null);
      setWallets(walletsRes.data || []);
      setEntries(entriesRes.data || []);
      setStatements(statementsRes.data || []);
      setInvoices(invoicesRes.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleTransfer = async (transferData) => {
    try {
      await transferFunds(transferData);
      showToast('Wallet funds transferred successfully');
      setIsTransferOpen(false);
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleFactoringSubmit = async (factoringData) => {
    try {
      await submitFactoringInvoice(factoringData);
      showToast('Invoice submitted and advance funding approved');
      setIsFactoringOpen(false);
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAutoReconcile = async () => {
    try {
      const res = await runAutoReconciliation();
      showToast(`Smart reconciliation complete! ${res.reconciledCount} transactions matched.`);
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTransfer={() => setIsTransferOpen(true)}
        onOpenFactoring={() => setIsFactoringOpen(true)}
      />

      {toast && <div className={`toast-notification toast-${toast.type}`}>{toast.message}</div>}

      <main className="main-content">
        <TreasuryGrid metrics={metrics} loading={loading} />

        {activeTab === 'treasury' && (
          <div className="tab-pane">
            <div className="enrollments-view">
              <div className="enrollments-header-row">
                <h3>Corporate Business Wallets ({wallets.length})</h3>
                <button className="btn-primary-sm" onClick={() => setIsTransferOpen(true)}>+ Transfer Funds</button>
              </div>
              <div className="course-grid">
                {wallets.map((w) => (
                  <div key={w._id} className="stat-card">
                    <div className="stat-icon-wrapper">💼</div>
                    <div>
                      <span className="stat-label">{w.businessName}</span>
                      <h3 className="stat-value">${w.availableBalance.toLocaleString()} {w.currency}</h3>
                      <span className="text-muted">Wallet ID: {w.walletId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="tab-pane">
            <LedgerTable entries={entries} loading={loading} onOpenNewEntry={() => showToast('Use Transfer or Factoring to post balanced double-entry journals', 'info')} />
          </div>
        )}

        {activeTab === 'reconciliation' && (
          <div className="tab-pane">
            <ReconciliationBoard statements={statements} onRunAutoMatch={handleAutoReconcile} loading={loading} />
          </div>
        )}

        {activeTab === 'factoring' && (
          <div className="tab-pane">
            <div className="enrollments-view">
              <div className="enrollments-header-row">
                <h3>Factored Invoices ({invoices.length})</h3>
                <button className="btn-primary" onClick={() => setIsFactoringOpen(true)}>+ Factor New Invoice</button>
              </div>
              <div className="table-responsive">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Issuer</th>
                      <th>Debtor</th>
                      <th>Total Amount</th>
                      <th>Advance Rate</th>
                      <th>Funded Advance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv._id}>
                        <td><strong>{inv.invoiceNumber}</strong></td>
                        <td>{inv.issuerBusiness}</td>
                        <td>{inv.debtorBusiness}</td>
                        <td>${inv.totalAmount.toLocaleString()}</td>
                        <td>{(inv.advanceRate * 100).toFixed(0)}%</td>
                        <td className="price-tag">${inv.fundedAmount.toLocaleString()}</td>
                        <td><span className="status-pill status-completed">{inv.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} wallets={wallets} onTransferSubmit={handleTransfer} />
      <FactoringModal isOpen={isFactoringOpen} onClose={() => setIsFactoringOpen(false)} onFactoringSubmit={handleFactoringSubmit} />
    </div>
  );
}

export default App;
