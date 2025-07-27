import { IWhatsAppService, WhatsAppMessage } from '../../interfaces/IWhatsAppService';

export class MockWhatsAppService implements IWhatsAppService {
  private isInitialized = false;
  private sentMessages: WhatsAppMessage[] = [];

  async initialize(): Promise<void> {
    this.isInitialized = true;
    console.log('Mock WhatsApp: Initialized');
  }

  async sendMessage(message: WhatsAppMessage): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('WhatsApp client not initialized');
    }
    
    this.sentMessages.push(message);
    console.log('Mock WhatsApp: Sent message', message);
  }

  isConnected(): boolean {
    return this.isInitialized;
  }

  // Test helper methods
  getSentMessages(): WhatsAppMessage[] {
    return [...this.sentMessages];
  }

  clear(): void {
    this.sentMessages = [];
  }
} 