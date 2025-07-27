import express, { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { corsMiddleware } from './cors';
import messageRoutes from '../routes/messageRoutes';
import whatsappRoutes from '../routes/whatsappRoutes';

const app: Application = express();

// CORS configuration
app.use(corsMiddleware);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
});
app.use(limiter);
app.use(express.json());

app.use('/api/messages', messageRoutes);
app.use('/api/whatsapp', whatsappRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/debug-sentry', (req: Request, res: Response) => {
  throw new Error('My first Sentry error!');
});

export default app; 