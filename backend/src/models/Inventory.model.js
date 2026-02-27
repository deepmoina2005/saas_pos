const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Tenant = require('./Tenant.model');
const Product = require('./Product.model');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tenant,
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  low_stock_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  }
}, {
  tableName: 'inventory',
  timestamps: true
});

// Relationships
Inventory.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Tenant.hasMany(Inventory, { foreignKey: 'tenant_id' });

Inventory.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasOne(Inventory, { foreignKey: 'product_id', as: 'inventory_details' });

module.exports = Inventory;
