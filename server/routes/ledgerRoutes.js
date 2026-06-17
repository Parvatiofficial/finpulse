const express = require('express');
const router = express.Router();
const { getJournalEntries, postJournalEntry, getTrialBalance } = require('../controllers/ledgerController');

router.route('/')
  .get(getJournalEntries)
  .post(postJournalEntry);

router.get('/trial-balance', getTrialBalance);

module.exports = router;
