const express = require('express');
const router  = express.Router();

const zones = [
  { id: 'a1', name: 'Academic Block A', temp: 22.4, setpoint: 22, status: 'normal',  humidity: 55 },
  { id: 'a2', name: 'Academic Block B', temp: 23.1, setpoint: 22, status: 'warning', humidity: 62 },
  { id: 'b1', name: 'Lab Block 1',      temp: 21.8, setpoint: 21, status: 'normal',  humidity: 50 },
  { id: 'b2', name: 'Lab Block 2',      temp: 22.0, setpoint: 21, status: 'normal',  humidity: 51 },
  { id: 'c1', name: 'Library',          temp: 20.5, setpoint: 21, status: 'normal',  humidity: 48 },
  { id: 'h1', name: 'Hostel Block A',   temp: 24.2, setpoint: 24, status: 'normal',  humidity: 60 },
  { id: 'h2', name: 'Hostel Block B',   temp: 24.0, setpoint: 24, status: 'normal',  humidity: 59 },
  { id: 'h3', name: 'Hostel Block C',   temp: 29.1, setpoint: 24, status: 'offline', humidity: 75 },
  { id: 'c2', name: 'Cafeteria',        temp: 25.0, setpoint: 24, status: 'normal',  humidity: 65 },
  { id: 'a3', name: 'Admin Block',      temp: 22.2, setpoint: 22, status: 'normal',  humidity: 53 },
];

// GET /api/hvac
router.get('/', (req, res) => {
  res.json({ zones, summary: { total: 20, online: 18, offline: 2 } });
});

// GET /api/hvac/:id
router.get('/:id', (req, res) => {
  const zone = zones.find(z => z.id === req.params.id);
  if (!zone) return res.status(404).json({ error: 'Zone not found' });
  res.json(zone);
});

// PATCH /api/hvac/:id — update setpoint
router.patch('/:id', (req, res) => {
  const zone = zones.find(z => z.id === req.params.id);
  if (!zone) return res.status(404).json({ error: 'Zone not found' });
  const { setpoint } = req.body;
  if (setpoint !== undefined) zone.setpoint = setpoint;
  res.json({ success: true, zone });
});

module.exports = router;
