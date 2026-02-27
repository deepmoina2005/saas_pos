const reportsService = require('./reports.service');
const logger = require('../../config/logger');

const getDailySales = async (req, res, next) => {
  try {
    const data = await reportsService.getDailySales(req.tenantId);
    res.status(200).json(data);
  } catch (error) {
    logger.error('Report error - daily sales:', error);
    next(error);
  }
};

const getTaxSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ message: 'startDate and endDate required' });

    const data = await reportsService.getTaxSummary(req.tenantId, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getInventoryValuation = async (req, res, next) => {
  try {
    const data = await reportsService.getInventoryValuation(req.tenantId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await reportsService.getTopProducts(req.tenantId, limit);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Main Dashboard summary
const getDashboardSummary = async (req, res, next) => {
    try {
        const dailySales = await reportsService.getDailySales(req.tenantId);
        const topProducts = await reportsService.getTopProducts(req.tenantId, 5);
        
        res.status(200).json({
            dailySales,
            topProducts
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
  getDailySales,
  getTaxSummary,
  getInventoryValuation,
  getTopProducts,
  getDashboardSummary
};
