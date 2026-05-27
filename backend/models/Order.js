const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const MenuItem = require('./MenuItem');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  idempotencyKey: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'rejected', 'failed', 'delivered'),
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Order.belongsTo(User);
Order.belongsTo(MenuItem);

module.exports = Order;
