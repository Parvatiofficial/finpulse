const express = require('express');
const router = express.Router();
const { getStatements, runAutoReconciliation } = require('../controllers/reconciliationController');

router.get('/statements', getStatements);
router.post('/auto-match', runAutoReconciliation);

module.exports = router;
