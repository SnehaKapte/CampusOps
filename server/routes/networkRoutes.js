const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.json({
    bandwidth:    { usage: Math.round(65 + Math.random() * 15), total: 1000, unit: 'Mbps' },
    latency:      Math.round(12 + Math.random() * 6),
    uptime:       99.8,
    wifiClients:  Math.round(320 + Math.random() * 80),
    coreSwitches: { online: 4, total: 4, utilization: 68 },
    wifiAPs:      { online: 48, total: 50 },
    firewallRules: 142,
    threatsBlocked: Math.round(Math.random() * 5),
    history:      Array.from({ length: 24 }, (_, i) => ({
      hour:  `${i}:00`,
      usage: Math.round(30 + Math.sin((i - 8) * Math.PI / 10) * 35 + Math.random() * 10)
    }))
  });
});

module.exports = router;
