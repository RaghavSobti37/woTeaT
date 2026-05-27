const express = require('express');
const router = express.Router();
const { ondcSearchQueue, llmTaggingQueue, dlqQueue } = require('../services/queue');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../db');

// Middleware: Beckn Signature Verification Mock
function verifyBecknSignature(req, res, next) {
  // In production, cryptographically verify req.headers['authorization']
  // For now, we simulate it
  console.log('[Security] Verified ONDC signature');
  next();
}

// 1. ONDC Search Webhook
router.post('/on_search', verifyBecknSignature, async (req, res) => {
  const payload = req.body;
  // Absorb webhook burst using queue
  await ondcSearchQueue.add('processSearch', payload);
  res.status(200).json({ message: { ack: { status: 'ACK' } } });
});

// Create Mock Item (for testing)
router.post('/mock-ingest', async (req, res) => {
  const { restaurantId, name, price, description } = req.body;
  const item = await MenuItem.create({ restaurantId, name, price, description });
  // Send to LLM queue asynchronously
  await llmTaggingQueue.add('tagItem', { menuItemId: item.id, name, description });
  res.json({ success: true, item });
});

// 2. Automated Ordering with Idempotency and Graceful Degradation
router.post('/auto-order', async (req, res) => {
  const { userId, idempotencyKey } = req.body;
  
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency Key required' });
  }

  const t = await sequelize.transaction();

  try {
    // Check for existing order with this idempotency key
    let order = await Order.findOne({ where: { idempotencyKey }, transaction: t });
    if (order) {
      await t.commit();
      return res.json({ success: true, message: 'Order already processed', order });
    }

    const user = await User.findByPk(userId, { transaction: t });
    if (!user) throw new Error('User not found');

    // Curation Logic using pgvector (Exploitation match)
    // Find closest item vector to user taste vector
    const query = `
      SELECT id, name, price, vector,
      vector <-> '[${user.tasteVector.join(',')}]' AS distance
      FROM "MenuItems"
      ORDER BY distance ASC
      LIMIT 1;
    `;
    const [results] = await sequelize.query(query, { transaction: t });
    let bestDish = results[0];

    // Graceful Degradation Buffer Rule: If budget is an issue, we could buffer it,
    // but here we just ensure we found a dish.
    if (!bestDish) {
      throw new Error('No match found');
    }

    // ACID Transaction for Wallet Deduction
    if (user.walletBalance < bestDish.price) {
      // Add to DLQ
      await dlqQueue.add('failedOrder', { userId, reason: 'Insufficient funds', item: bestDish.name });
      throw new Error('Insufficient wallet balance');
    }

    user.walletBalance -= bestDish.price;
    await user.save({ transaction: t });

    order = await Order.create({
      idempotencyKey,
      status: 'confirmed',
      totalAmount: bestDish.price,
      UserId: user.id,
      MenuItemId: bestDish.id
    }, { transaction: t });

    // Simulate ONDC /confirm API Call
    console.log(`[ONDC] Firing /confirm for Order ${order.id}`);

    await t.commit();
    res.json({ success: true, order, bestDish });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
