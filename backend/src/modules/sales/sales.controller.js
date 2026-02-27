const salesService = require('./sales.service');
const logger = require('../../config/logger');

const processCheckout = async (req, res, next) => {
  try {
    const { items, paymentMode, discount, isIntraState } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const result = await salesService.processCheckout(req.tenantId, req.user.id, {
      items, paymentMode, discount, isIntraState
    });

    res.status(201).json({
      message: 'Sale processed successfully',
      ...result 
    });
  } catch (error) {
    logger.error('Checkout error:', error);
    next(error);
  }
};

const getSalesHistory = async (req, res, next) => {
  try {
    const history = await salesService.getSalesHistory(req.tenantId);
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};

const getInvoiceDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = await salesService.getInvoiceDetails(req.tenantId, id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    
    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processCheckout,
  getSalesHistory,
  getInvoiceDetails
};
