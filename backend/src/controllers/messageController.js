const messageQueue = require('../config/queue');
const { validateMessage } = require('../utils/validation');
const { publishEvent } = require('../services/rabbitmqService');
const { logMessage } = require('../services/dbService');

async function sendMessage(req, res) {
  const { error, value } = validateMessage(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const job = await messageQueue.add(value, {
      attempts: 5, // Retry up to 5 times
      backoff: {
        type: 'exponential',
        delay: 3000, // Initial delay 3s
      },
    });
    console.log('Message queued', job.id);
    // Log message as queued
    await logMessage({ jobId: job.id, phone: value.phone, message: value.message, status: 'queued' });
    // Publish event to RabbitMQ
    await publishEvent('message.queued', { ...value, jobId: job.id });
    res.status(202).json({ jobId: job.id, status: 'queued' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enqueue message' });
  }
}

module.exports = { sendMessage }; 