const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.json({
    cctv:          { online: 142, total: 148, recording: 142 },
    accessControl: { online: 24, total: 24, activeCards: 3820 },
    intrusionDet:  { status: 'active', zones: 32, triggered: 0 },
    incidents:     { today: 0, thisWeek: 2, resolved: 2 },
    lastPatrol:    '08:45 AM',
    recentEvents: [
      { time: '09:14', type: 'access', msg: 'Gate A1 — Faculty card scan (Dr. Kumar)' },
      { time: '09:02', type: 'camera', msg: 'Lab Block camera CAM-047 reconnected' },
      { time: '08:50', type: 'access', msg: 'Server room access — IT Admin Rahul' },
      { time: '08:33', type: 'alert',  msg: '6 CCTV cameras offline in Lab Block' },
    ]
  });
});

module.exports = router;
