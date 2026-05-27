const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  restaurantId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vector: {
    type: DataTypes.VECTOR(5),
    allowNull: true // Tagged asynchronously by LLM
  }
}, {
  indexes: [
    {
      fields: ['vector'],
      using: 'hnsw',
      operator: 'vector_cosine_ops'
    }
  ]
});

module.exports = MenuItem;
