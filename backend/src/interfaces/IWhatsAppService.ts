export interface WhatsAppMessage {
  phone: string;
  message: string;
}

export interface IWhatsAppService {
  initialize(): Promise<void>;
  sendMessage(message: WhatsAppMessage): Promise<void>;
  isConnected(): boolean;
  getConnectionStatus(): { isConnected: boolean; phone?: string };
  getQRCode(): Promise<string | null>;
  clearCredentials(): Promise<void>;
  forceNewSession(): Promise<void>;
} 