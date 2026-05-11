const express = require('express');
const router  = express.Router();

// GET /api/metrics — Live aggregated dashboard metrics
router.get('/', (req, res) => {
  const hour = new Date().getHours();

  // Simulate realistic values
  const rand = (base, variance) => +(base + (Math.random() - 0.5) * variance).toFixed(1);

  res.json({
    energy:         { current: Math.round(rand(847, 80)), unit: 'kWh', trend: 'down', trendPct: 12 },
    networkUptime:  { value: +rand(99.8, 0.2).toFixed(1), unit: '%' },
    activeServices: { online: 24, total: 26 },
    serverLoad:     { cpu: Math.round(rand(63, 10)), memory: Math.round(rand(58, 10)) },
    hvacZones:      { online: 18, total: 20 },
    alertsToday:    { total: 7, resolved: 3, open: 4 },
    timestamp:      new Date().toISOString()
  });
});

module.exports = router;
