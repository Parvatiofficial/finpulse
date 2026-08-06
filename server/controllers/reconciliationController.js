const BankStatement = require('../models/BankStatement');
const JournalEntry = require('../models/JournalEntry');
const { matchTransaction } = require('../services/reconciliationMatcher');

exports.getStatements = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'ALL' ? { status } : {};
    const statements = await BankStatement.find(query).sort({ transactionDate: -1 });
    res.status(200).json({ success: true, count: statements.length, data: statements });
  } catch (error) {
    next(error);
  }
};

exports.runAutoReconciliation = async (req, res, next) => {
  try {
    const unmatched = await BankStatement.find({ status: { $in: ['UNMATCHED', 'PROBABLE_MATCH'] } });
    const journalEntries = await JournalEntry.find().sort({ postedAt: -1 }).limit(100);

    let reconciledCount = 0;
    for (const bankTx of unmatched) {
      const matchResult = matchTransaction(bankTx, journalEntries);
      if (matchResult.matched && matchResult.matchedEntry) {
        bankTx.status = 'RECONCILED';
        bankTx.matchedEntryId = matchResult.matchedEntry._id;
        await bankTx.save();
        reconciledCount += 1;
      }
    }

    res.status(200).json({
      success: true,
      message: `Automated matching evaluated ${unmatched.length} bank feed items.`,
      reconciledCount
    });
  } catch (error) {
    next(error);
  }
};
