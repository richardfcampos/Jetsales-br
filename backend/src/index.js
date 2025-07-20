const Sentry = require('@sentry/node');
require('dotenv').config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
  environment: process.env.NODE_ENV || 'development',
});

const app = require('./config/express');
const { initBaileys } = require('./services/whatsappService');
const registerMessageJob = require('./jobs/messageJob');
const startConsumer = require('./consumers/whatsappConsumer');

const port = process.env.PORT || 3000;

(async () => {
  initBaileys();
  startConsumer();
  registerMessageJob();
  Sentry.setupExpressErrorHandler(app);
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
