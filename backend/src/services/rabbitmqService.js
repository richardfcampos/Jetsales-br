const amqp = require('amqplib');

async function connectRabbitMQWithRetry(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq');
      return connection;
    } catch (err) {
      console.error(`RabbitMQ connection failed (attempt ${i + 1}):`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function publishEvent(queue, message) {
  const connection = await connectRabbitMQWithRetry();
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  await channel.close();
  await connection.close();
}

module.exports = { connectRabbitMQWithRetry, publishEvent }; 