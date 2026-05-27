const { Sequelize } = require('sequelize');
const pg = require('pg');
require('pg-hstore');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URL || process.env.POSTGRES_URI || 'postgres://postgres:password@localhost:5432/woteat', {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  dialectOptions: (process.env.POSTGRES_URL || process.env.POSTGRES_URI) ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});

module.exports = sequelize;
