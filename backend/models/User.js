const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  locationLat: {
    type: DataTypes.FLOAT
  },
  locationLng: {
    type: DataTypes.FLOAT
  },
  walletBalance: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tasteVector: {
    type: DataTypes.VECTOR(5)
  },
  tastePersona: {
    type: DataTypes.STRING,
    defaultValue: 'Explorer'
  },
  otp: {
    type: DataTypes.STRING
  },
  otpExpires: {
    type: DataTypes.DATE
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  indexes: [
    {
      fields: ['tasteVector'],
      using: 'hnsw',
      operator: 'vector_cosine_ops' // Required by pgvector for cosine distance
    }
  ]
});

module.exports = User;
