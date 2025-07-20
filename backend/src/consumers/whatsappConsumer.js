const amqp = require('amqplib');
const { sendWhatsAppMessage } = require('../services/whatsappService');
const { updateMessageStatus } = require('../services/dbService');
const Sentry = require('@sentry/node');
require('dotenv').config();

async function startConsumer() {
  const queue = 'message.to_send';
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const channel = await conn.createChannel();
  await channel.assertQueue(queue, { durable: true });
  console.log(`Waiting for messages in ${queue}...`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const data = JSON.parse(msg.content.toString());
        await sendWhatsAppMessage({ phone: data.phone, message: data.message });
        console.log('About to update DB for job', data.jobId);
        await updateMessageStatus(data.jobId, 'sent');
        console.log('DB updated for job', data.jobId);
        channel.ack(msg);
      } catch (err) {
        Sentry.captureException(err, { extra: { msg: msg.content.toString() } });
        try {
          await updateMessageStatus(JSON.parse(msg.content.toString()).jobId, 'failed');
        } catch (dbErr) {
          console.error('Failed to update DB status to failed:', dbErr);
        }
        console.error('Failed to process message.to_send:', err);
        channel.nack(msg, false, false); // Discard message after failure
      }
    }
  });
}

module.exports = startConsumer; 