const { Category, Product, Inventory, sequelize } = require('../../models');
const { Op } = require('sequelize');

// --- CATEGORIES ---
const getCategories = async (tenantId) => {
  return await Category.findAll({ where: { tenant_id: tenantId } });
};

const createCategory = async (tenantId, name) => {
  return await Category.create({ tenant_id: tenantId, name });
};

// --- PRODUCTS ---
const getProducts = async (tenantId) => {
  return await Product.findAll({
    where: { tenant_id: tenantId },
    include: [
      { model: Category, as: 'category', attributes: ['name'] },
      { model: Inventory, as: 'inventory_details', attributes: ['quantity', 'low_stock_threshold'] }
    ]
  });
};

const createProduct = async (tenantId, productData) => {
  const t = await sequelize.transaction();

  try {
    // Basic automatic SKU generation if not provided
    const sku = productData.sku || `SKU-${Date.now().toString().slice(-6)}`;

    const product = await Product.create({
      tenant_id: tenantId,
      category_id: productData.category_id || null,
      name: productData.name,
      sku,
      barcode: productData.barcode || null,
      hsn_code: productData.hsn_code || null,
      base_price: productData.base_price,
      tax_rate: productData.tax_rate || 0,
      is_tax_inclusive: productData.is_tax_inclusive || false,
    }, { transaction: t });

    // Ensure inventory record is created for absolute integrity
    await Inventory.create({
      tenant_id: tenantId,
      product_id: product.id,
      quantity: productData.initial_quantity || 0,
      low_stock_threshold: productData.low_stock_threshold || 5
    }, { transaction: t });

    await t.commit();
    return product;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const updateProductInfo = async (tenantId, productId, data) => {
  const product = await Product.findOne({ where: { id: productId, tenant_id: tenantId } });
  if (!product) throw new Error('Product not found');
  
  return await product.update(data);
};

// --- INVENTORY ---
const updateStock = async (tenantId, productId, quantityDelta) => {
  const inventory = await Inventory.findOne({ where: { product_id: productId, tenant_id: tenantId } });
  if (!inventory) throw new Error('Inventory record not found');
  
  // Can be positive (purchase) or negative (sale or return)
  inventory.quantity = Number(inventory.quantity) + Number(quantityDelta);
  await inventory.save();
  return inventory;
};

const getLowStockAlerts = async (tenantId) => {
  return await Inventory.findAll({
    where: { 
      tenant_id: tenantId,
      quantity: { [Op.lte]: sequelize.col('low_stock_threshold') }
    },
    include: [{ model: Product, as: 'product', attributes: ['name', 'sku'] }]
  });
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
