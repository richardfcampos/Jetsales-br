import messageQueue from '../config/queue';
import { ServiceContainer } from '../container/ServiceContainer';
import * as Sentry from '@sentry/node';
import { Job } from 'bull';

interface MessageJobData {
  phone: string;
  message: string;
}

export default function registerMessageJob(): void {
  messageQueue.process(async (job: Job<MessageJobData>) => {
    const { phone, message } = job.data;
    const container = ServiceContainer.getInstance();
    const messageQueueService = container.getMessageQueueService();
    const databaseService = container.getDatabaseService();
    
    try {
      // Publish event to RabbitMQ for WhatsApp consumer
      await messageQueueService.publishEvent('message.to_send', { jobId: job.id, phone, message });
      await databaseService.updateMessageStatus(String(job.id), 'queued_for_send');
      console.log(`Published message.to_send event for job ${job.id}`);
    } catch (err) {
      await databaseService.updateMessageStatus(String(job.id), 'failed');
      Sentry.captureException(err, { extra: { jobId: job.id, phone, message } });
      console.error(`Failed to publish message.to_send for job ${job.id}:`, err);
      throw err;
    }
  });

  messageQueue.on('failed', (job: Job, err: Error) => {
    console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, err);
    Sentry.captureException(err, { extra: { jobId: job.id, attempts: job.attemptsMade, data: job.data } });
  });
} 