# WhatsApp CRM

A free WhatsApp CRM with connector architecture for future Meta API integration.

## Features
- Lead Management (CRUD)
- Message Templates with variables
- WhatsApp Web Integration (Free)
- Dashboard with Analytics
- Activity Logging
- Connector Architecture (WhatsApp Web → Meta API ready)

## Tech Stack
- Frontend: HTML, CSS, JavaScript, Bootstrap (Single Page App)
- Backend: Node.js, Express
- Database: SQLite
- WhatsApp: whatsapp-web.js (free)

## Live Demo
Frontend: https://softappweber.github.io/wacrmbyds

## Quick Start

### Backend (Local)
1. `cd backend`
2. `npm install`
3. `npm start`
4. Server runs on http://localhost:3000

### Frontend
Open `index.html` in browser or deploy to GitHub Pages

## Deployment

### GitHub Pages (Frontend)
1. Push `index.html` to repo root
2. Enable GitHub Pages in repo settings
3. Update `API_BASE_URL` in index.html with backend URL

### Render (Backend)
1. Push `backend` folder to GitHub
2. Deploy on Render (free tier)
3. Set build command: `npm install`
4. Set start command: `npm start`

## Default Credentials
- Username: admin
- Password: admin123

## Future: Meta API Integration
Replace `WhatsAppConnector` with `MetaAPIConnector` in `backend/connectors/whatsapp-connector.js`

## License
MIT
