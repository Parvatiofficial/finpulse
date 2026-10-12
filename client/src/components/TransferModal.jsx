import React, { useState } from 'react';

const TransferModal = ({ isOpen, onClose, wallets, onTransferSubmit }) => {
  const [fromWallet, setFromWallet] = useState(wallets[0]?.walletId || '');
  const [toWallet, setToWallet] = useState(wallets[1]?.walletId || '');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onTransferSubmit({
      fromWalletId: fromWallet,
      toWalletId: toWallet,
      amount: parseFloat(amount),
    });
    setAmount('');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-sm">
        <div className="modal-header">
          <h3>B2B Wallet Transfer</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Source Wallet *</label>
            <select value={fromWallet} onChange={(e) => setFromWallet(e.target.value)}>
              {wallets.map((w) => (
                <option key={w.walletId} value={w.walletId}>
                  {w.businessName} (${w.availableBalance.toLocaleString()} {w.currency})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Destination Wallet *</label>
            <select value={toWallet} onChange={(e) => setToWallet(e.target.value)}>
              {wallets.map((w) => (
                <option key={w.walletId} value={w.walletId}>
                  {w.businessName} ({w.walletId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Transfer Amount (USD) *</label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 15000"
            />
          </div>

          <div className="checkout-guarantee">
            🔒 Protected by Automated Idempotency Key & Double-Entry Invariants
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Execute Transfer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;
