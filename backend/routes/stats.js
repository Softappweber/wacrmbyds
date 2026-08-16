const express = require('express');
const router = express.Router();
const { db } = require('../database');

router.get('/', (req, res) => {
  const totalLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
  const activeLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status != 'Converted' AND status != 'Lost'").get().count;
  const convertedLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Converted'").get().count;
  const recentActivity = db.prepare('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 10').all();
  
  const statusDistribution = db.prepare('SELECT status, COUNT(*) as count FROM leads GROUP BY status').all();
  
  res.json({
    totalLeads,
    activeLeads,
    convertedLeads,
    recentActivity,
    statusDistribution
  });
});

module.exports = router;
