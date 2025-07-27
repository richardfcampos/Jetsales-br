import { default as makeWASocket, useMultiFileAuthState, DisconnectReason, WASocket, ConnectionState } from 'baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import { IWhatsAppService, WhatsAppMessage } from '../../interfaces/IWhatsAppService';
import * as fs from 'fs';
import * as path from 'path';

export class BaileysWhatsAppService implements IWhatsAppService {
  private baileysSocket?: WASocket;
  private isInitialized = false;
  private isInitializing = false;
  private currentQRCode: string | null = null;
  private phoneNumber: string | undefined;
  private connectionState: 'connecting' | 'open' | 'close' = 'connecting';

  async initialize(): Promise<void> {
    if (this.isInitializing) {
      return; // Already initializing
    }
    
    this.isInitializing = true;
    
    // Return immediately and handle initialization asynchronously
    setTimeout(async () => {
      try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    this.baileysSocket = makeWASocket({
      auth: state,
    });
    this.baileysSocket.ev.on('creds.update', saveCreds);

    this.baileysSocket.ev.on('connection.update', (update: Partial<ConnectionState>) => {
      const { connection, lastDisconnect, qr } = update;

          if (connection) { // Track connection state
            this.connectionState = connection;
          }

      if (qr) {
        console.log('QR STRING:', qr);
            this.currentQRCode = qr; // Store QR code
        qrcode.generate(qr, { small: true });
        console.log('Scan the QR code above with your WhatsApp app.');
      }
          if (connection === 'open') { // Update state on successful connection
            this.currentQRCode = null;
            this.phoneNumber = this.baileysSocket?.user?.id?.split('@')[0];
            console.log('WhatsApp connected successfully');
          }
      if (connection === 'close') {
            this.phoneNumber = undefined; // Clear phone number on close
            this.currentQRCode = null; // Clear QR code on close
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          void this.initialize();
        }
      }
    });

    this.isInitialized = true;
        this.isInitializing = false;
      } catch (error) {
        console.error('Error in background initialization:', error);
        this.isInitializing = false;
      }
    }, 0);
    
    return;
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
    return this.isInitialized && !!this.baileysSocket && this.connectionState === 'open'; // Check actual connection state
  }

  getConnectionStatus(): { isConnected: boolean; phone?: string } {
    return {
      isConnected: this.isConnected(),
      phone: this.phoneNumber
    };
  }

  async getQRCode(): Promise<string | null> {
    return this.currentQRCode;
  }

  async clearCredentials(): Promise<void> {
    try {
      // Close existing socket if any
      if (this.baileysSocket) {
        try {
          await this.baileysSocket.logout();
        } catch (error) {
          console.log('Socket logout error (expected):', (error as Error).message);
        }
        this.baileysSocket = undefined;
      }
      
      // Reset state variables
      this.isInitialized = false;
      this.isInitializing = false;
      this.currentQRCode = null;
      this.phoneNumber = undefined;
      this.connectionState = 'connecting';
      
      // Clear the auth_info directory
      const authInfoPath = './auth_info';
      if (fs.existsSync(authInfoPath)) {
        try {
          const files = fs.readdirSync(authInfoPath);
          for (const file of files) {
            const filePath = path.join(authInfoPath, file);
            if (fs.statSync(filePath).isFile()) {
              fs.unlinkSync(filePath);
            }
          }
          fs.rmdirSync(authInfoPath);
          console.log('Auth info directory cleared successfully');
        } catch (error) {
          console.error('Error clearing auth info directory:', error);
        }
      }
      
      console.log('Credentials cleared successfully');
    } catch (error) {
      console.error('Error in clearCredentials:', error);
    }
  }

  async forceNewSession(): Promise<void> {
    await this.clearCredentials();
    await this.initialize();
  }
} 