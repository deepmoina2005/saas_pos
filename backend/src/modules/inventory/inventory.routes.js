const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

router.use(authenticate);

// --- CATEGORIES ---
router.get('/categories', inventoryController.getCategories);
router.post('/categories', authorize(['OWNER', 'MANAGER']), inventoryController.createCategory);

// --- PRODUCTS ---
router.get('/products', inventoryController.getProducts);
router.post('/products', authorize(['OWNER', 'MANAGER']), inventoryController.createProduct);
router.patch('/products/:id', authorize(['OWNER', 'MANAGER']), inventoryController.updateProductInfo);

// --- INVENTORY ---
router.patch('/products/:id/stock', authorize(['OWNER', 'MANAGER']), inventoryController.updateStock);
router.get('/low-stock', authorize(['OWNER', 'MANAGER']), inventoryController.getLowStockAlerts);

module.exports = router;
