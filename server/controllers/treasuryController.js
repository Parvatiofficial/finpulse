const Wallet = require('../models/Wallet');
const BankStatement = require('../models/BankStatement');
const FactoringInvoice = require('../models/FactoringInvoice');

exports.getTreasuryDashboard = async (req, res, next) => {
  try {
    const wallets = await Wallet.find();
    let totalLiquidity = 0;
    wallets.forEach((w) => (totalLiquidity += w.availableBalance));

    const totalReconciledVolume = await BankStatement.aggregate([
      { $match: { status: 'RECONCILED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const activeFactoredAR = await FactoringInvoice.aggregate([
      { $match: { status: { $in: ['APPROVED', 'DISBURSED'] } } },
      { $group: { _id: null, total: { $sum: '$fundedAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLiquidity: Number(totalLiquidity.toFixed(2)),
        activeWalletsCount: wallets.length,
        reconciledVolume: totalReconciledVolume[0] ? Number(totalReconciledVolume[0].total.toFixed(2)) : 0,
        activeFactoredVolume: activeFactoredAR[0] ? Number(activeFactoredAR[0].total.toFixed(2)) : 0,
        currency: 'USD'
      }
    });
  } catch (error) {
    next(error);
  }
};
