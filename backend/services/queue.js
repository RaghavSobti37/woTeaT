const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const llmService = require('./llm');
const MenuItem = require('../models/MenuItem');

const hasRedis = !!process.env.REDIS_URL;
let connection;

if (hasRedis) {
  connection = new Redis(process.env.REDIS_URL);
}

class MockQueue {
  constructor(name) { this.name = name; }
  async add(name, data) {
    console.log(`[MockQueue ${this.name}] Added job: ${name}`, data);
    // Execute job immediately for testing
    if (this.name === 'llmTagging') {
      setTimeout(async () => {
        const { menuItemId, name: dishName, description } = data;
        const vector = await llmService.generateTasteVector(dishName, description);
        await MenuItem.update({ vector }, { where: { id: menuItemId } });
        console.log(`[MockQueue llmTagging] Tagged ${dishName} with vector`, vector);
      }, 100);
    }
  }
}

// 1. ONDC Search Queue
const ondcSearchQueue = hasRedis ? new Queue('ondcSearch', { connection }) : new MockQueue('ondcSearch');

// 2. LLM Tagging Queue
const llmTaggingQueue = hasRedis ? new Queue('llmTagging', { connection }) : new MockQueue('llmTagging');

// 3. Dead Letter Queue
const dlqQueue = hasRedis ? new Queue('dlq', { connection }) : new MockQueue('dlq');

if (hasRedis) {
  new Worker('llmTagging', async (job) => {
    const { menuItemId, name, description } = job.data;
    const vector = await llmService.generateTasteVector(name, description);
    await MenuItem.update({ vector }, { where: { id: menuItemId } });
  }, { connection });

  new Worker('dlq', async (job) => {
    console.log(`[DLQ Worker] Processing failed order`, job.data);
  }, { connection });
}

module.exports = {
  ondcSearchQueue,
  llmTaggingQueue,
  dlqQueue
};
