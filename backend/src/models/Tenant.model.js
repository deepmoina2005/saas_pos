const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Subscription = require('./Subscription.model');

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gstin: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true // Important for GST calc (Intra vs Inter state)
  },
  subscription_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subscription,
      key: 'id'
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tenants',
  timestamps: true
});

// Relationships
Tenant.belongsTo(Subscription, { foreignKey: 'subscription_id', as: 'subscription' });
Subscription.hasMany(Tenant, { foreignKey: 'subscription_id', as: 'tenants' });

module.exports = Tenant;
