const messageQueue = require('../config/queue');
const { publishEvent } = require('../services/rabbitmqService');
const { updateMessageStatus } = require('../services/dbService');
const Sentry = require('@sentry/node');

function registerMessageJob() {
  messageQueue.process(async (job) => {
    const { phone, message } = job.data;
    try {
      // Publish event to RabbitMQ for WhatsApp consumer
      await publishEvent('message.to_send', { jobId: job.id, phone, message });
      await updateMessageStatus(job.id, 'queued_for_send');
      console.log(`Published message.to_send event for job ${job.id}`);
    } catch (err) {
      await updateMessageStatus(job.id, 'failed');
      Sentry.captureException(err, { extra: { jobId: job.id, phone, message } });
      console.error(`Failed to publish message.to_send for job ${job.id}:`, err);
      throw err;
    }
  });

  messageQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, err);
    Sentry.captureException(err, { extra: { jobId: job.id, attempts: job.attemptsMade, data: job.data } });
  });
}

module.exports = registerMessageJob; 