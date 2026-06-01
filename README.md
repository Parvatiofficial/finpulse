# ⚡ FinPulse — Enterprise B2B Digital Banking, Double-Entry Ledger & Invoice Factoring

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**FinPulse** is a mission-critical full-stack MERN FinTech platform architected for corporate treasury teams, neobanks, and B2B lending institutions. It delivers strict double-entry ledger accounting, multi-currency commercial wallets, automated bank statement reconciliation, and accounts receivable invoice factoring with automated credit risk underwriting.

---

## 🌟 Core Financial Engine Architecture

### 📑 1. Immutable Double-Entry General Ledger
- **Strict Accounting Balance Invariants:** Every journal entry strictly enforces `totalDebits === totalCredits`. Unbalanced transactions are rejected at the model pre-validation boundary.
- **Tamper-Evident SHA-256 Hash Chaining:** Each journal entry cryptographically binds its line items to the previous entry's hash, forming an immutable audit trail.
- **Standardized Chart of Accounts:** Automated categorization across `Assets`, `Liabilities`, `Equity`, `Revenue`, and `Expenses`.

### 💼 2. Multi-Currency Business Wallets & Transfers
- **Multi-Currency Support:** Native balances for `USD`, `EUR`, `GBP`, `INR`, and `SGD`.
- **Idempotent Transfers:** All financial transfers require an `Idempotency-Key` header, guaranteeing zero double-debit errors under network retries.
- **Escrow & Pending Holds:** Segregates available liquidity from locked settlement funds.

### 🔄 3. Automated Bank Feed Statement Reconciliation
- **Smart Rule Matching:** Compares bank statements against internal ledger transactions.
- **Fuzzy Reference Scoring:** Matches transactions by exact amount (50 pts), reference string tokens (30 pts), and ±3 day date tolerance (20 pts).
- **Discrepancy Resolution:** Classifies records into `UNMATCHED`, `PROBABLE_MATCH`, and `RECONCILED`.

### 💳 4. B2B Accounts Receivable Invoice Factoring
- **Dynamic Credit Risk Scoring:** Computes risk ratings (0–100) based on debtor payment history, concentration limits, and days-to-due.
- **Instant Liquidity Advance:** Automatically calculates advance rates (up to 90% in Tier A) and discounts factoring fees for immediate working capital funding.
- **Underwriting State Machine:** Transitions invoices from `SUBMITTED` ➔ `UNDERWRITING` ➔ `APPROVED` ➔ `DISBURSED` ➔ `SETTLED`.

### 📊 5. Real-Time Treasury Dashboard
- **Consolidated Working Capital:** Aggregates multi-wallet balances, total reconciled volume, and outstanding factored receivables into real-time KPI metrics.
- **Non-Blocking Audit Logging:** Asynchronously records every financial mutation to `AuditTrail` collection without impacting request latency.

---

## 🏗️ Technical Architecture Diagram

```text
+-----------------------------------------------------------------------------------+
|                            FinPulse Web Client                                    |
|               (React 18, Emerald & Slate Dark Tokens, Real-time Grid)             |
+-----------------------------------------+-----------------------------------------+
                                          | HTTPS / REST
                                          v
+-----------------------------------------------------------------------------------+
|                        FinPulse Treasury API Gateway                              |
|   Sliding Rate Limiter | Idempotency Lock | CORS | Non-Blocking Audit Logger      |
+-----------------------------------------+-----------------------------------------+
                                          |
        +------------------+--------------+--------------+------------------+
        |                  |                             |                  |
        v                  v                             v                  v
+---------------+  +---------------+             +---------------+  +---------------+
|  Double-Entry |  |  Multi-Curr   |             |  Smart Bank   |  |  Invoice      |
|  Ledger Engine|  |  Wallet Engine|             |  Reconciler   |  |  Factoring    |
|  Controllers  |  |  Controllers  |             |  Controllers  |  |  Controllers  |
+-------+-------+  +-------+-------+             +-------+-------+  +-------+-------+
        |                  |                             |                  |
        +------------------+--------------+--------------+------------------+
                                          | Mongoose ODM
                                          v
                               +--------------------+
                               |    MongoDB 6.0     |
                               | (Accounts, Entries,|
                               |  Wallets, Invoices,|
                               |  Bank Feeds, Audit)|
                               +--------------------+
```

---

## 📡 RESTful API Endpoints Manual

| Method | Endpoint | Description | Domain |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Treasury engine uptime & ledger verification probe | System |
| `GET` | `/api/v1/treasury/metrics` | Real-time liquidity, reconciled volume & factored totals | Treasury |
| `GET` | `/api/v1/ledger` | Query journal entries with pagination and search | Ledger |
| `POST` | `/api/v1/ledger` | Post balanced double-entry journal entry with SHA-256 hash | Ledger |
| `GET` | `/api/v1/ledger/trial-balance` | Generate real-time balanced trial balance statement | Ledger |
| `GET` | `/api/v1/wallets` | List corporate multi-currency wallets | Wallets |
| `POST` | `/api/v1/wallets/transfer` | Execute idempotent peer-to-peer wallet transfer | Wallets |
| `GET` | `/api/v1/reconciliation/statements` | Fetch bank statement feed items with match status | Reconciliation |
| `POST` | `/api/v1/reconciliation/auto-match` | Execute smart fuzzy auto-matching reconciliation | Reconciliation |
| `GET` | `/api/v1/factoring` | List submitted and approved factored invoices | Factoring |
| `POST` | `/api/v1/factoring` | Submit B2B invoice, calculate risk score & advance rate | Factoring |

---

## ⚡ Quickstart Guide

### Option 1: Docker Compose (All-in-One Orchestration)
```bash
docker-compose up --build -d
```
The FinPulse Treasury API will be live on `http://localhost:5006`.

### Option 2: Local Manual Setup

#### 1. Backend Server Setup
```bash
# Install dependencies
npm install

# Seed Chart of Accounts, initial wallets, and ledger entries
npm run seed

# Run automated financial test suites
npm test

# Start Express server in development mode
npm run dev
```

#### 2. Frontend Client Setup
```bash
cd client
npm install
npm start
```
Open `http://localhost:3000` to interact with the FinPulse Treasury Dashboard.

---

## 🧪 Comprehensive Automated Test Suites

FinPulse includes 7 test suites validating financial balance constraints and cryptographic integrity:
```bash
npm test
```
- `doubleEntry.test.js`: Asserts strict debit/credit equality enforcement and rejects unbalanced entries.
- `ledgerHash.test.js`: Verifies deterministic SHA-256 cryptographic chain generation.
- `idempotency.test.js`: Tests `Idempotency-Key` replay cache to prevent duplicate transactions.
- `reconciliation.test.js`: Tests fuzzy reference matching, date tolerances, and confidence scoring.
- `factoring.test.js`: Asserts Tier A/B/C credit scoring and advance fee computations.
- `security.test.js`: Verifies non-negative amount constraints and input sanitization.
- `e2e.test.js`: Full lifecycle test: Wallet transfer ➔ Journal entry ➔ Bank match ➔ Factoring payout.

---

## 📜 License & Authorship

Distributed under the **MIT License**. See [`LICENSE`](file:///LICENSE) for full details.

Developed & Maintained by **[Parvatiofficial](https://github.com/Parvatiofficial)** (<Parvati@trydigitalsolution.com>).
