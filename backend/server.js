const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./db');
const User = require('./models/User'); // Import models to register them
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const authRoutes = require('./routes/auth');
const ondcRoutes = require('./routes/ondc');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ondc', ondcRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;').then(() => {
    return sequelize.sync({ alter: true });
  }).then(() => {
    console.log('Connected to Postgres and synchronized models');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => console.error('Failed to connect to Postgres', err));
} else {
  // In production (Vercel), we skip sync on every cold start to avoid timeouts/race conditions.
  // Models are just exported for queries.
  console.log('Skipping sync in production. Ensure DB schema is up to date.');
}

module.exports = app;
