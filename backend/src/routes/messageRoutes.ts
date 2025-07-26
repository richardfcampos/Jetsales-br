import { Router } from 'express';
import { sendMessage } from '../controllers/messageController';

const router: Router = Router();

router.post('/send-message', sendMessage);

export default router; 