import React from 'react';

const LedgerTable = ({ entries, loading, onOpenNewEntry }) => {
  if (loading) return <div className="catalog-loading">Retrieving double-entry journal records...</div>;

  return (
    <div className="enrollments-view">
      <div className="enrollments-header-row">
        <h3>General Ledger Journal Entries ({entries.length})</h3>
        <button className="btn-primary" onClick={onOpenNewEntry}>+ Post Journal Entry</button>
      </div>

      <div className="table-responsive">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Entry ID</th>
              <th>Description</th>
              <th>Debit Accounts</th>
              <th>Credit Accounts</th>
              <th>Hash Verification</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const debits = entry.lines.filter((l) => l.type === 'DEBIT');
              const credits = entry.lines.filter((l) => l.type === 'CREDIT');
              const totalAmount = debits.reduce((sum, l) => sum + l.amount, 0);

              return (
                <tr key={entry._id}>
                  <td><strong>{entry.entryNumber}</strong></td>
                  <td>{entry.description}</td>
                  <td>
                    {debits.map((d, i) => (
                      <div key={i} className="line-item line-debit">
                        {d.accountName} (${d.amount.toFixed(2)})
                      </div>
                    ))}
                  </td>
                  <td>
                    {credits.map((c, i) => (
                      <div key={i} className="line-item line-credit">
                        {c.accountName} (${c.amount.toFixed(2)})
                      </div>
                    ))}
                  </td>
                  <td>
                    <span className="cert-badge" title={entry.hash}>
                      {entry.hash.substring(0, 10)}...
                    </span>
                  </td>
                  <td className="text-muted">{new Date(entry.postedAt).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerTable;
