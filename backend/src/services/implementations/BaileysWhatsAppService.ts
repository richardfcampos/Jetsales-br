import { default as makeWASocket, useMultiFileAuthState, DisconnectReason, WASocket, ConnectionState } from 'baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import { IWhatsAppService, WhatsAppMessage } from '../../interfaces/IWhatsAppService';

export class BaileysWhatsAppService implements IWhatsAppService {
  private baileysSocket?: WASocket;
  private isInitialized = false;

  async initialize(): Promise<void> {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    this.baileysSocket = makeWASocket({
      auth: state,
    });
    this.baileysSocket.ev.on('creds.update', saveCreds);

    this.baileysSocket.ev.on('connection.update', (update: Partial<ConnectionState>) => {
      const { connection, lastDisconnect, qr } = update;
      if (qr) {
        console.log('QR STRING:', qr);
        qrcode.generate(qr, { small: true });
        console.log('Scan the QR code above with your WhatsApp app.');
      }
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          void this.initialize();
        }
      }
    });

    this.isInitialized = true;
  }

  async sendMessage(message: WhatsAppMessage): Promise<void> {
    if (!this.baileysSocket) {
      throw new Error('WhatsApp client not initialized');
    }
    
    const jid = message.phone.replace(/[^\d]/g, '') + '@s.whatsapp.net';
    await this.baileysSocket.sendMessage(jid, { text: message.message });
    console.log(`WhatsApp message sent to ${message.phone}`);
  }

  isConnected(): boolean {
    return this.isInitialized && !!this.baileysSocket;
  }
} 