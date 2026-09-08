const express = require('express');
const router = express.Router();
const { getInvoices, submitInvoice } = require('../controllers/factoringController');

router.route('/')
  .get(getInvoices)
  .post(submitInvoice);

module.exports = router;
