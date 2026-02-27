const { sequelize } = require('../config/db');

// Import all models to ensure they are registered with Sequelize
const Subscription = require('./Subscription.model');
const Tenant = require('./Tenant.model');
const Role = require('./Role.model');
const User = require('./User.model');
const Category = require('./Category.model');
const Product = require('./Product.model');
const Inventory = require('./Inventory.model');
const Sale = require('./Sale.model');
const SaleItem = require('./SaleItem.model');
const Invoice = require('./Invoice.model');

// Export models and sequelize connection
module.exports = {
  sequelize,
  Subscription,
  Tenant,
  Role,
  User,
  Category,
  Product,
  Inventory,
  Sale,
  SaleItem,
  Invoice
};
