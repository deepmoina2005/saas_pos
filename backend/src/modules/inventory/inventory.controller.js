const inventoryService = require('./inventory.service');
const logger = require('../../config/logger');

// --- CATEGORIES ---
const getCategories = async (req, res, next) => {
  try {
    const categories = await inventoryService.getCategories(req.tenantId);
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const category = await inventoryService.createCategory(req.tenantId, name);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// --- PRODUCTS ---
const getProducts = async (req, res, next) => {
  try {
    const products = await inventoryService.getProducts(req.tenantId);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await inventoryService.createProduct(req.tenantId, req.body);
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    logger.error('Error creating product:', error);
    next(error);
  }
};

const updateProductInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await inventoryService.updateProductInfo(req.tenantId, id, req.body);
    res.status(200).json({ message: 'Product updated', product: updated });
  } catch (error) {
    next(error);
  }
};

// --- INVENTORY ---
const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params; // Product ID
    const { quantityDelta } = req.body; // e.g., +10 or -5

    if (quantityDelta === undefined) {
       return res.status(400).json({ message: 'quantityDelta is required' });
    }

    const inventory = await inventoryService.updateStock(req.tenantId, id, quantityDelta);
    res.status(200).json({ message: 'Stock updated', inventory });
  } catch (error) {
    next(error);
  }
};

const getLowStockAlerts = async (req, res, next) => {
  try {
    const alerts = await inventoryService.getLowStockAlerts(req.tenantId);
    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  getProducts,
  createProduct,
  updateProductInfo,
  updateStock,
  getLowStockAlerts
};
