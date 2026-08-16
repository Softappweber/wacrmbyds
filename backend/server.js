const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://yourusername.github.io'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'whatsapp-crm-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

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
