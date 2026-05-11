const express = require('express');
const router  = express.Router();

// GET /api/energy
router.get('/', (req, res) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const history = days.map(day => ({
    day,
    actual: Math.round(800 + Math.random() * 150),
    target: 900
  }));

  res.json({
    current:       Math.round(820 + Math.random() * 60),
    unit:          'kWh',
    solar:         Math.round(140 + Math.random() * 30),
    grid:          Math.round(680 + Math.random() * 50),
    backup:        'Standby',
    solarPct:      87,
    gridPct:       100,
    history,
    savingsThisMonth: '₹48,200',
    co2Saved:      '1.2 tons'
  });
});

module.exports = router;
