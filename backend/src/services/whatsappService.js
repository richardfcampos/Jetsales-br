const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');

let baileysSocket;

async function initBaileys() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  baileysSocket = makeWASocket({
    auth: state,
    // printQRInTerminal: true, // REMOVE THIS LINE
  });
  baileysSocket.ev.on('creds.update', saveCreds);

  baileysSocket.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log('QR STRING:', qr);
      // Print QR code in terminal
      qrcode.generate(qr, { small: true });
      console.log('Scan the QR code above with your WhatsApp app.');
    }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        initBaileys();
      }
    }
  });
}

async function sendWhatsAppMessage({ phone, message }) {
  if (!baileysSocket) throw new Error('WhatsApp client not initialized');
  const jid = phone.replace(/[^\d]/g, '') + '@s.whatsapp.net';
  await baileysSocket.sendMessage(jid, { text: message });
  console.log(`WhatsApp message sent to ${phone}`);
}

module.exports = { initBaileys, sendWhatsAppMessage }; 