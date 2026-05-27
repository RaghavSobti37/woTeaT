const { Sequelize } = require('sequelize');
const pg = require('pg');
const pgvector = require('pgvector/sequelize');
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

// Register pgvector support
pgvector.registerType(Sequelize);

module.exports = sequelize;
