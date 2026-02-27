const express = require('express');
const router = express.Router();
const salesController = require('./sales.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

router.use(authenticate);

// Create a new sale (Checkout)
router.post('/checkout', authorize(['OWNER', 'MANAGER', 'CASHIER']), salesController.processCheckout);

// View sales history
router.get('/', authorize(['OWNER', 'MANAGER']), salesController.getSalesHistory);

// View specific invoice
router.get('/invoice/:id', authorize(['OWNER', 'MANAGER', 'CASHIER']), salesController.getInvoiceDetails);

module.exports = router;
