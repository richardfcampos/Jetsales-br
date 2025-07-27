import { Request, Response } from 'express';
import { ServiceContainer } from '../container/ServiceContainer';

export async function getConnectionStatus(req: Request, res: Response): Promise<void> {
  try {
    const container = ServiceContainer.getInstance();
    const whatsAppService = container.getWhatsAppService();
    
    const status = whatsAppService.getConnectionStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting connection status:', error);
    res.status(500).json({ error: 'Failed to get connection status' });
  }
}

export async function getQRCode(req: Request, res: Response): Promise<void> {
  try {
    const container = ServiceContainer.getInstance();
    const whatsAppService = container.getWhatsAppService();
    
    const qrCode = await whatsAppService.getQRCode();
    
    if (qrCode) {
      res.json({ qrCode });
    } else {
      res.status(404).json({ error: 'No QR code available' });
    }
  } catch (error) {
    console.error('Error getting QR code:', error);
    res.status(500).json({ error: 'Failed to get QR code' });
  }
}

export async function initialize(req: Request, res: Response): Promise<void> {
  try {
    const container = ServiceContainer.getInstance();
    const whatsAppService = container.getWhatsAppService();
    
    // Return immediately and handle initialization in background
    res.json({ message: 'WhatsApp service initialization started' });
    
    // Handle initialization asynchronously
    setTimeout(async () => {
      try {
        // Always clear credentials first to ensure fresh login
        await whatsAppService.clearCredentials();
        
        // Then initialize to get fresh QR code
        await whatsAppService.initialize();
      } catch (error) {
        console.error('Error in background initialization:', error);
      }
    }, 0);
    
  } catch (error) {
    console.error('Error starting WhatsApp initialization:', error);
    res.status(500).json({ error: 'Failed to start WhatsApp initialization' });
  }
}
