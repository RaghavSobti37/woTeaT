const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URL || process.env.POSTGRES_URI || 'postgres://postgres:password@localhost:5432/woteat', {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
