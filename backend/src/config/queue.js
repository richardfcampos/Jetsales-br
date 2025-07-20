const Bull = require('bull');

const messageQueue = new Bull('message-queue', {
  redis: { host: 'redis', port: 6379 },
});

module.exports = messageQueue; 