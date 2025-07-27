export interface WhatsAppMessage {
  phone: string;
  message: string;
}

export interface IWhatsAppService {
  initialize(): Promise<void>;
  sendMessage(message: WhatsAppMessage): Promise<void>;
  isConnected(): boolean;
} 