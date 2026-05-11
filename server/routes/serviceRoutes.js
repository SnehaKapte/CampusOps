const express = require('express');
const router  = express.Router();
const store   = require('../utils/mockStore');

// GET /api/services
router.get('/', (req, res) => {
  res.json({ services: store.getServices() });
});

// GET /api/services/health — must come BEFORE /:id to avoid being swallowed by the param route
router.get('/health', (req, res) => {
  const services = store.getServices();
  const allUp = services.every(s => s.status !== 'down');
  res.json({ status: allUp ? 'healthy' : 'degraded', services, timestamp: new Date().toISOString() });
});

// GET /api/services/:id
router.get('/:id', (req, res) => {
  const service = store.getServices().find(s => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

module.exports = router;
