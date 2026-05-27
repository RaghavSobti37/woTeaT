const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URL || process.env.POSTGRES_URI || 'postgres://postgres:password@localhost:5432/woteat', {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
});

module.exports = sequelize;
