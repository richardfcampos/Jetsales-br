import Bull, { Queue } from 'bull';

const messageQueue: Queue = new Bull('message-queue', {
  redis: { host: 'redis', port: 6379 },
});

export default messageQueue; 