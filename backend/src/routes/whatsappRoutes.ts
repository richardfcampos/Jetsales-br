import { Router } from 'express';
import { getConnectionStatus, getQRCode, initialize } from '../controllers/whatsappController';
import { sendMessage } from '../controllers/messageController';

const router = Router();

// Get current connection status
router.get('/status', getConnectionStatus);

// Get QR code for login
router.get('/qr-code', getQRCode);

// Initialize WhatsApp service (Login)
router.post('/initialize', initialize);

// Send message via WhatsApp
router.post('/send-message', sendMessage);

export default router; 
