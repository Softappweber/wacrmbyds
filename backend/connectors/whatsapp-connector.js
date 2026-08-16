const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppConnector {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });
    this.status = 'initializing';
    this.setupEvents();
  }

  setupEvents() {
    this.client.on('qr', (qr) => {
      this.status = 'waiting_qr';
      this.qrCode = qr;
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.status = 'connected';
      console.log('WhatsApp connected');
    });

    this.client.on('disconnected', () => {
      this.status = 'disconnected';
    });
  }

  async connect() {
    await this.client.initialize();
    return this.qrCode;
  }

  getStatus() {
    return this.status;
  }

  async sendMessage(phone, message) {
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    const chatId = `${formattedPhone}@c.us`;
    await this.client.sendMessage(chatId, message);
  }

  async disconnect() {
    await this.client.destroy();
  }
}

// Meta API Connector (Future)
class MetaAPIConnector {
  constructor(apiKey, phoneNumberId) {
    this.apiKey = apiKey;
    this.phoneNumberId = phoneNumberId;
    this.status = 'connected';
  }

  async sendMessage(phone, message) {
    // Future implementation
    // POST https://graph.facebook.com/v17.0/{phoneNumberId}/messages
  }
}

module.exports = { WhatsAppConnector, MetaAPIConnector };
