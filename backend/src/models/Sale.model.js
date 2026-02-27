const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Tenant = require('./Tenant.model');
const User = require('./User.model');

const Sale = sequelize.define('Sale', {
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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cgst_total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  sgst_total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  igst_total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  payment_mode: {
    type: DataTypes.ENUM('CASH', 'UPI', 'CARD', 'SPLIT'),
    defaultValue: 'CASH'
  }
}, {
  tableName: 'sales',
  timestamps: true // created_at mapped automatically
});

// Relationships
Sale.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Tenant.hasMany(Sale, { foreignKey: 'tenant_id' });

Sale.belongsTo(User, { foreignKey: 'user_id', as: 'cashier' });

module.exports = Sale;
