import React, { useState } from 'react';

const FactoringModal = ({ isOpen, onClose, onFactoringSubmit }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    issuerBusiness: '',
    debtorBusiness: '',
    totalAmount: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onFactoringSubmit({
      ...formData,
      totalAmount: parseFloat(formData.totalAmount)
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Factor B2B Accounts Receivable Invoice</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Invoice Number *</label>
              <input
                type="text"
                required
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                placeholder="e.g. INV-2026-9901"
              />
            </div>
            <div className="form-group">
              <label>Invoice Total Amount ($ USD) *</label>
              <input
                type="number"
                step="100"
                min="500"
                required
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                placeholder="e.g. 50000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Issuer Business Name *</label>
              <input
                type="text"
                required
                value={formData.issuerBusiness}
                onChange={(e) => setFormData({ ...formData, issuerBusiness: e.target.value })}
                placeholder="e.g. Apex Cloud Solutions"
              />
            </div>
            <div className="form-group">
              <label>Debtor Customer Business *</label>
              <input
                type="text"
                required
                value={formData.debtorBusiness}
                onChange={(e) => setFormData({ ...formData, debtorBusiness: e.target.value })}
                placeholder="e.g. Fortune 500 Enterprise"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Issue Date *</label>
              <input
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="checkout-guarantee">
            ⚡ Instant credit scoring: Up to 90% immediate liquidity disbursement upon risk clearance.
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Submit for Advance Funding</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FactoringModal;
