const JournalEntry = require('../models/JournalEntry');
const Account = require('../models/Account');
const { calculateEntryHash } = require('../services/ledgerHasher');

exports.getJournalEntries = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.description = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const entries = await JournalEntry.find(query).sort({ postedAt: -1 }).skip(skip).limit(Number(limit));
    const total = await JournalEntry.countDocuments(query);

    res.status(200).json({ success: true, count: entries.length, total, data: entries });
  } catch (error) {
    next(error);
  }
};

exports.postJournalEntry = async (req, res, next) => {
  try {
    const { description, referenceId, currency = 'USD', lines } = req.body;

    const lastEntry = await JournalEntry.findOne().sort({ createdAt: -1 });
    const prevHash = lastEntry ? lastEntry.hash : 'GENESIS_BLOCK_0000000000000000';
    const entryNumber = `JE-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const hash = calculateEntryHash(prevHash, entryNumber, lines, new Date());

    const entry = await JournalEntry.create({
      entryNumber,
      description,
      referenceId,
      currency,
      lines,
      prevHash,
      hash,
      postedAt: new Date()
    });

    // Update account balances
    for (const line of lines) {
      const delta = line.type === 'DEBIT' ? line.amount : -line.amount;
      await Account.findOneAndUpdate({ accountNumber: line.accountNumber }, { $inc: { balance: delta } });
    }

    res.status(201).json({ success: true, message: 'Double-entry journal posted successfully', data: entry });
  } catch (error) {
    next(error);
  }
};

exports.getTrialBalance = async (req, res, next) => {
  try {
    const accounts = await Account.find({ isActive: true });
    let totalDebit = 0;
    let totalCredit = 0;

    accounts.forEach((acc) => {
      if (acc.balance >= 0) totalDebit += acc.balance;
      else totalCredit += Math.abs(acc.balance);
    });

    res.status(200).json({
      success: true,
      data: {
        accounts,
        totalDebit: Number(totalDebit.toFixed(2)),
        totalCredit: Number(totalCredit.toFixed(2)),
        isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
      }
    });
  } catch (error) {
    next(error);
  }
};
