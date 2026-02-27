const express = require('express');
const router = express.Router();
const reportsController = require('./reports.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

router.use(authenticate);
router.use(authorize(['OWNER', 'MANAGER'])); // Restrict reports to management

router.get('/dashboard', reportsController.getDashboardSummary);
router.get('/daily-sales', reportsController.getDailySales);
router.get('/tax-summary', reportsController.getTaxSummary);
router.get('/inventory-valuation', reportsController.getInventoryValuation);
router.get('/top-products', reportsController.getTopProducts);

module.exports = router;
