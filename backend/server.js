const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./db');
const User = require('./models/User'); // Import models to register them
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) // Sync models with database
  .then(() => {
    console.log('Connected to Postgres and synchronized models');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to Postgres', err);
  });
