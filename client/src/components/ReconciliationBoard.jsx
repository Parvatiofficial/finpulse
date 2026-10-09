import React from 'react';

const ReconciliationBoard = ({ statements, onRunAutoMatch, loading }) => {
  return (
    <div className="enrollments-view">
      <div className="enrollments-header-row">
        <div>
          <h3>Automated Bank Feed Statements</h3>
          <p className="text-muted">Compare bank transactions against internal double-entry records</p>
        </div>
        <button className="btn-primary" onClick={onRunAutoMatch} disabled={loading}>
          {loading ? 'Evaluating Feeds...' : '⚡ Run Smart Auto-Reconciliation'}
        </button>
      </div>

      <div className="table-responsive">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Statement ID</th>
              <th>Bank & Account</th>
              <th>Counterparty</th>
              <th>Reference</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {statements.map((stmt) => (
              <tr key={stmt._id}>
                <td><strong>{stmt.statementId}</strong></td>
                <td>{stmt.bankName} ({stmt.accountNumber})</td>
                <td>{stmt.counterparty}</td>
                <td>{stmt.reference}</td>
                <td className="price-tag">${stmt.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-pill status-${stmt.status.toLowerCase()}`}>
                    {stmt.status}
                  </span>
                </td>
                <td className="text-muted">{new Date(stmt.transactionDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReconciliationBoard;
