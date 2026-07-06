const Wallet = require('../models/Wallet');

exports.getWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.find().sort({ availableBalance: -1 });
    res.status(200).json({ success: true, count: wallets.length, data: wallets });
  } catch (error) {
    next(error);
  }
};

exports.transferFunds = async (req, res, next) => {
  try {
    const { fromWalletId, toWalletId, amount, currency = 'USD' } = req.body;
    const transferAmount = Number(amount);

    if (transferAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Transfer amount must be greater than zero' });
    }

    const source = await Wallet.findOne({ walletId: fromWalletId });
    if (!source) return res.status(404).json({ success: false, error: 'Source wallet not found' });
    if (source.availableBalance < transferAmount) {
      return res.status(400).json({ success: false, error: 'Insufficient available funds in source wallet' });
    }

    const destination = await Wallet.findOne({ walletId: toWalletId });
    if (!destination) return res.status(404).json({ success: false, error: 'Destination wallet not found' });

    source.availableBalance -= transferAmount;
    await source.save();

    destination.availableBalance += transferAmount;
    await destination.save();

    res.status(200).json({
      success: true,
      message: `Successfully transferred ${transferAmount} ${currency}`,
      data: {
        from: source.walletId,
        to: destination.walletId,
        amount: transferAmount,
        currency,
        newSourceBalance: source.availableBalance
      }
    });
  } catch (error) {
    next(error);
  }
};
