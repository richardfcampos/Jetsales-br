import amqp from 'amqplib';
import { IMessageQueueService } from '../../interfaces/IMessageQueueService';

export class RabbitMQMessageQueueService implements IMessageQueueService {
  private connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  async connect(): Promise<void> {
    // Connection is established per publish for simplicity
  }

  async publishEvent(queue: string, message: unknown): Promise<void> {
    const connection = await amqp.connect(this.connectionString);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    await channel.close();
    await (connection as any).close();
  }

  async close(): Promise<void> {
    // No persistent connection to close
  }
} 