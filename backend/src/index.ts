import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import app from './config/express';
import { ServiceContainer } from './container/ServiceContainer';
import registerMessageJob from './jobs/messageJob';
import startConsumer from './consumers/whatsappConsumer';

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
  environment: process.env.NODE_ENV || 'development',
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

(async () => {
  const container = ServiceContainer.getInstance();
  const whatsAppService = container.getWhatsAppService();
  
  await whatsAppService.initialize();
  startConsumer();
  registerMessageJob();
  Sentry.setupExpressErrorHandler(app);
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
