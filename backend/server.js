const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - Allow all for now
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'whatsapp-crm-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to false for HTTP
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'WhatsApp CRM API is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/whatsapp', require('./routes/whatsapp'));
app.use('/api/stats', require('./routes/stats'));

// Database initialization
const db = require('./database');
db.initialize();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
