import { default as makeWASocket, useMultiFileAuthState, DisconnectReason, WASocket, ConnectionState } from 'baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';

let baileysSocket: WASocket | undefined;

export async function initBaileys(): Promise<void> {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  baileysSocket = makeWASocket({
    auth: state,
  });
  baileysSocket.ev.on('creds.update', saveCreds);

  baileysSocket.ev.on('connection.update', (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log('QR STRING:', qr);
      qrcode.generate(qr, { small: true });
      console.log('Scan the QR code above with your WhatsApp app.');
    }
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        void initBaileys();
      }
    }
  });
}

export interface WhatsAppMessage {
  phone: string;
  message: string;
}

export async function sendWhatsAppMessage({ phone, message }: WhatsAppMessage): Promise<void> {
  if (!baileysSocket) throw new Error('WhatsApp client not initialized');
  const jid = phone.replace(/[^\d]/g, '') + '@s.whatsapp.net';
  await baileysSocket.sendMessage(jid, { text: message });
  console.log(`WhatsApp message sent to ${phone}`);
} 