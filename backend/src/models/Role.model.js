const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false // SUPER_ADMIN, OWNER, MANAGER, CASHIER
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true // Store specific permissions if needed
  }
}, {
  tableName: 'roles',
  timestamps: true
});

module.exports = Role;
