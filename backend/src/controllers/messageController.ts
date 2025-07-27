import { Request, Response } from 'express';
import messageQueue from '../config/queue';
import { validateMessage } from '../utils/validation';
import { ServiceContainer } from '../container/ServiceContainer';

export async function sendMessage(req: Request, res: Response): Promise<void> {
  const { error, value } = validateMessage(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  
  const container = ServiceContainer.getInstance();
  const databaseService = container.getDatabaseService();
  const messageQueueService = container.getMessageQueueService();
  
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
    await databaseService.logMessage({ jobId: String(job.id), phone: value.phone, message: value.message, status: 'queued' });
    // Publish event to RabbitMQ
    await messageQueueService.publishEvent('message.queued', { ...value, jobId: job.id });
    res.status(202).json({ jobId: job.id, status: 'queued' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enqueue message' });
  }
} 