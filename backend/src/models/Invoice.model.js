const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Tenant = require('./Tenant.model');
const Sale = require('./Sale.model');

const Invoice = sequelize.define('Invoice', {
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
  sale_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sale,
      key: 'id'
    }
  },
  invoice_number: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['tenant_id', 'invoice_number']
    }
  ]
});

// Relationships
Invoice.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Tenant.hasMany(Invoice, { foreignKey: 'tenant_id' });

Invoice.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });
Sale.hasOne(Invoice, { foreignKey: 'sale_id', as: 'invoice' });

module.exports = Invoice;
