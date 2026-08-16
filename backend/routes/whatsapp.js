const express = require('express');
const router = express.Router();
const { WhatsAppConnector } = require('../connectors/whatsapp-connector');

let whatsappClient = null;

router.get('/status', (req, res) => {
  res.json({ status: whatsappClient ? whatsappClient.getStatus() : 'disconnected' });
});

router.post('/connect', async (req, res) => {
  try {
    whatsappClient = new WhatsAppConnector();
    const qrCode = await whatsappClient.connect();
    res.json({ success: true, qrCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  
  if (!whatsappClient || whatsappClient.getStatus() !== 'connected') {
    return res.status(400).json({ success: false, message: 'WhatsApp not connected' });
  }
  
  try {
    await whatsappClient.sendMessage(phone, message);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/disconnect', async (req, res) => {
  if (whatsappClient) {
    await whatsappClient.disconnect();
    whatsappClient = null;
  }
  res.json({ success: true });
});

module.exports = router;
