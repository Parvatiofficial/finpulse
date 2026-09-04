const FactoringInvoice = require('../models/FactoringInvoice');
const { evaluateInvoice } = require('../services/factoringScorer');

exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await FactoringInvoice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    next(error);
  }
};

exports.submitInvoice = async (req, res, next) => {
  try {
    const { invoiceNumber, issuerBusiness, debtorBusiness, issueDate, dueDate, totalAmount, currency = 'USD' } = req.body;

    const evaluation = evaluateInvoice({ totalAmount: Number(totalAmount), debtorBusiness, dueDate, issueDate });

    const invoice = await FactoringInvoice.create({
      invoiceNumber: invoiceNumber.trim(),
      issuerBusiness: issuerBusiness.trim(),
      debtorBusiness: debtorBusiness.trim(),
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
      totalAmount: Number(totalAmount),
      currency,
      riskScore: evaluation.riskScore,
      advanceRate: evaluation.advanceRate,
      factoringFee: evaluation.factoringFee,
      fundedAmount: evaluation.fundedAmount,
      status: evaluation.eligible ? 'APPROVED' : 'UNDERWRITING'
    });

    res.status(201).json({
      success: true,
      message: 'Invoice submitted and evaluated for factoring advance',
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};
