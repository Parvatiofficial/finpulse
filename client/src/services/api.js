import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(new Error(err.response?.data?.error || err.message || 'Treasury API Gateway Error'))
);

// Treasury Endpoints
export const fetchTreasuryMetrics = () => apiClient.get('/treasury/metrics');
export const fetchWallets = () => apiClient.get('/wallets');
export const transferFunds = (payload, idempotencyKey) =>
  apiClient.post('/wallets/transfer', payload, {
    headers: { 'Idempotency-Key': idempotencyKey || `tx_${Date.now()}` }
  });

// Ledger Endpoints
export const fetchJournalEntries = (params) => apiClient.get('/ledger', { params });
export const postJournalEntry = (payload) => apiClient.post('/ledger', payload);
export const fetchTrialBalance = () => apiClient.get('/ledger/trial-balance');

// Reconciliation Endpoints
export const fetchBankStatements = (params) => apiClient.get('/reconciliation/statements', { params });
export const runAutoReconciliation = () => apiClient.post('/reconciliation/auto-match');

// Factoring Endpoints
export const fetchFactoringInvoices = () => apiClient.get('/factoring');
export const submitFactoringInvoice = (payload) => apiClient.post('/factoring', payload);

export default apiClient;
