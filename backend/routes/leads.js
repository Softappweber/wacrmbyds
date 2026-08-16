const express = require('express');
const router = express.Router();
const { db } = require('../database');

// Get all leads
router.get('/', (req, res) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.json(leads);
});

// Add lead
router.post('/', (req, res) => {
  const { name, phone, email, company, status, tags, notes } = req.body;
  const result = db.prepare('INSERT INTO leads (name, phone, email, company, status, tags, notes) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(name, phone, email, company, status || 'New', tags, notes);
  
  db.prepare('INSERT INTO activity_log (action, details, lead_id) VALUES (?, ?, ?)')
    .run('Lead Added', `Added lead: ${name}`, result.lastInsertRowid);
  
  res.json({ success: true, id: result.lastInsertRowid });
});

// Update lead
router.put('/:id', (req, res) => {
  const { name, phone, email, company, status, tags, notes } = req.body;
  db.prepare('UPDATE leads SET name=?, phone=?, email=?, company=?, status=?, tags=?, notes=? WHERE id=?')
    .run(name, phone, email, company, status, tags, notes, req.params.id);
  
  db.prepare('INSERT INTO activity_log (action, details, lead_id) VALUES (?, ?, ?)')
    .run('Lead Updated', `Updated lead: ${name}`, req.params.id);
  
  res.json({ success: true });
});

// Delete lead
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM leads WHERE id=?').run(req.params.id);
  db.prepare('INSERT INTO activity_log (action, details, lead_id) VALUES (?, ?, ?)')
    .run('Lead Deleted', 'Deleted lead', req.params.id);
  res.json({ success: true });
});

module.exports = router;
