import { IWhatsAppService, WhatsAppMessage } from '../../interfaces/IWhatsAppService';

export class MockWhatsAppService implements IWhatsAppService {
  private isInitialized = false;
  private sentMessages: WhatsAppMessage[] = [];
  private currentQRCode: string | null = null;
  private phoneNumber: string | undefined;
  private connectionState: 'connecting' | 'open' | 'close' = 'connecting';

  async initialize(): Promise<void> {
    this.isInitialized = true;
    this.connectionState = 'open';
    this.phoneNumber = '1234567890';
    this.currentQRCode = null;
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
    return this.isInitialized && this.connectionState === 'open';
  }

  getConnectionStatus(): { isConnected: boolean; phone?: string } {
    return {
      isConnected: this.isConnected(),
      phone: this.phoneNumber
    };
  }

  async getQRCode(): Promise<string | null> {
    return 'mock-qr-code';
  }

  async clearCredentials(): Promise<void> {
    this.isInitialized = false;
    this.phoneNumber = undefined;
  }

  // Test helper methods
  getSentMessages(): WhatsAppMessage[] {
    return [...this.sentMessages];
  }

  clear(): void {
    this.sentMessages = [];
  }
} 