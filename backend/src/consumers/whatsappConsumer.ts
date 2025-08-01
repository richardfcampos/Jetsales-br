import amqp from 'amqplib';
import { ServiceContainer } from '../container/ServiceContainer';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';

dotenv.config();

interface MessageToSend {
  jobId: string;
  phone: string;
  message: string;
}

export default async function startConsumer(): Promise<void> {
  const container = ServiceContainer.getInstance();
  const whatsAppService = container.getWhatsAppService();
  const databaseService = container.getDatabaseService();
  
  const queue = 'message.to_send';
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const channel = await conn.createChannel();
  await channel.assertQueue(queue, { durable: true });
  console.log(`Waiting for messages in ${queue}...`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const data: MessageToSend = JSON.parse(msg.content.toString());
        await whatsAppService.sendMessage({ phone: data.phone, message: data.message });
        console.log('About to update DB for job', data.jobId);
        await databaseService.updateMessageStatus(data.jobId, 'sent');
        console.log('DB updated for job', data.jobId);
        channel.ack(msg);
      } catch (err) {
        Sentry.captureException(err, { extra: { msg: msg.content.toString() } });
        try {
          const data: MessageToSend = JSON.parse(msg.content.toString());
          await databaseService.updateMessageStatus(data.jobId, 'failed');
        } catch (dbErr) {
          console.error('Failed to update DB status to failed:', dbErr);
        }
        console.error('Failed to process message.to_send:', err);
        channel.nack(msg, false, false); // Discard message after failure
      }
    }
  });
} 
