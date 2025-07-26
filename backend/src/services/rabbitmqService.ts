import amqp from 'amqplib';

export async function connectRabbitMQ() {
  return amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq');
}

export async function publishEvent(queue: string, message: unknown): Promise<void> {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  await channel.close();
  await (connection as any).close();
} 