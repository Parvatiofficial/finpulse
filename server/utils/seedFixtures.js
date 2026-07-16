const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Account = require('../models/Account');
const Wallet = require('../models/Wallet');
const JournalEntry = require('../models/JournalEntry');
const BankStatement = require('../models/BankStatement');
const FactoringInvoice = require('../models/FactoringInvoice');
const { calculateEntryHash } = require('../services/ledgerHasher');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing treasury records...');
    await Account.deleteMany({});
    await Wallet.deleteMany({});
    await JournalEntry.deleteMany({});
    await BankStatement.deleteMany({});
    await FactoringInvoice.deleteMany({});

    console.log('[Seed] Creating Chart of Accounts...');
    const accounts = await Account.insertMany([
      { accountNumber: '1010', name: 'Operating Cash Reserve', type: 'ASSET', currency: 'USD', balance: 540000 },
      { accountNumber: '1020', name: 'Escrow Settlement Clearing', type: 'ASSET', currency: 'USD', balance: 85000 },
      { accountNumber: '2010', name: 'Accounts Payable', type: 'LIABILITY', currency: 'USD', balance: 42000 },
      { accountNumber: '3010', name: 'Retained Treasury Capital', type: 'EQUITY', currency: 'USD', balance: 583000 }
    ]);

    console.log('[Seed] Creating Multi-Currency Wallets...');
    await Wallet.insertMany([
      { walletId: 'WLT-CORP-USD-01', businessName: 'Apex Cloud Solutions', ownerEmail: 'finance@apexcloud.io', currency: 'USD', availableBalance: 245000 },
      { walletId: 'WLT-CORP-EUR-02', businessName: 'Nordic Logistics GmbH', ownerEmail: 'treasury@nordic.de', currency: 'EUR', availableBalance: 180000 },
      { walletId: 'WLT-CORP-GBP-03', businessName: 'Thames Capital UK', ownerEmail: 'accounts@thamescap.co.uk', currency: 'GBP', availableBalance: 115000 }
    ]);

    console.log('[Seed] Creating initial Journal Entry with SHA-256 hash...');
    const lines = [
      { account: accounts[0]._id, accountNumber: '1010', accountName: 'Operating Cash Reserve', type: 'DEBIT', amount: 50000 },
      { account: accounts[3]._id, accountNumber: '3010', accountName: 'Retained Treasury Capital', type: 'CREDIT', amount: 50000 }
    ];
    const hash = calculateEntryHash('GENESIS', 'JE-100001', lines, new Date());
    await JournalEntry.create({
      entryNumber: 'JE-100001',
      description: 'Q2 Initial Working Capital Injection',
      currency: 'USD',
      lines,
      prevHash: 'GENESIS',
      hash
    });

    console.log('[Seed] Creating Bank Statements for reconciliation...');
    await BankStatement.insertMany([
      { statementId: 'STMT-901', bankName: 'JPMorgan Chase', accountNumber: 'CHASE-4901', transactionDate: new Date(), amount: 50000, reference: 'Working Capital Injection', counterparty: 'Apex Treasury', status: 'UNMATCHED' },
      { statementId: 'STMT-902', bankName: 'Barclays UK', accountNumber: 'BARC-1102', transactionDate: new Date(), amount: 15400, reference: 'Vendor Payout - Cloud Hosting', counterparty: 'AWS EMEA', status: 'UNMATCHED' }
    ]);

    console.log('[Seed] Creating Factoring Invoices...');
    await FactoringInvoice.insertMany([
      { invoiceNumber: 'INV-2026-8801', issuerBusiness: 'Apex Cloud Solutions', debtorBusiness: 'Global Telecom Corp', issueDate: new Date('2026-09-01'), dueDate: new Date('2026-10-15'), totalAmount: 48000, riskScore: 88, advanceRate: 0.90, factoringFee: 720, fundedAmount: 42480, status: 'APPROVED' },
      { invoiceNumber: 'INV-2026-8802', issuerBusiness: 'Nordic Logistics GmbH', debtorBusiness: 'Euro Retail S.A.', issueDate: new Date('2026-09-15'), dueDate: new Date('2026-11-15'), totalAmount: 32000, riskScore: 78, advanceRate: 0.80, factoringFee: 800, fundedAmount: 24800, status: 'APPROVED' }
    ]);

    console.log('[Seed] FinPulse fixtures populated successfully!');
    if (require.main === module) process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    if (require.main === module) process.exit(1);
  }
};

if (require.main === module) seedData();
module.exports = seedData;
