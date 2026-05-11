const express = require('express');
const router  = express.Router();
const store   = require('../utils/mockStore');

// GET /api/alerts
router.get('/', (req, res) => {
  let alerts = store.getAlerts();
  const { severity, resolved, limit = 20 } = req.query;

  if (severity) alerts = alerts.filter(a => a.severity === severity);
  if (resolved !== undefined) alerts = alerts.filter(a => a.resolved === (resolved === 'true'));

  res.json({ count: alerts.length, alerts: alerts.slice(0, Number(limit)) });
});

// GET /api/alerts/:id
router.get('/:id', (req, res) => {
  const alert = store.getAlertById(req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
});

// POST /api/alerts/:id/resolve
router.post('/:id/resolve', (req, res) => {
  const alert = store.resolveAlert(req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json({ success: true, alert });
});

module.exports = router;
