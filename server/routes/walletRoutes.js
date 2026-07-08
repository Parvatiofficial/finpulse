const express = require('express');
const router = express.Router();
const { getWallets, transferFunds } = require('../controllers/walletController');

router.get('/', getWallets);
router.post('/transfer', transferFunds);

module.exports = router;
