const express = require('express');
const router = express.Router();
const { db } = require('../database');

router.get('/', (req, res) => {
  const templates = db.prepare('SELECT * FROM templates ORDER BY created_at DESC').all();
  res.json(templates);
});

router.post('/', (req, res) => {
  const { name, content, category } = req.body;
  const result = db.prepare('INSERT INTO templates (name, content, category) VALUES (?, ?, ?)')
    .run(name, content, category);
  res.json({ success: true, id: result.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { name, content, category } = req.body;
  db.prepare('UPDATE templates SET name=?, content=?, category=? WHERE id=?')
    .run(name, content, category, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM templates WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
