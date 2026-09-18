const express = require('express');
const router = express.Router();
const { getTreasuryDashboard } = require('../controllers/treasuryController');

router.get('/metrics', getTreasuryDashboard);

module.exports = router;
