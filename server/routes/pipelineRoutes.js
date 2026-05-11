const express = require('express');
const router  = express.Router();
const store   = require('../utils/mockStore');

// GET /api/pipeline/status
router.get('/status', (req, res) => {
  res.json(store.getLatestPipelineRun());
});

// GET /api/pipeline/runs
router.get('/runs', (req, res) => {
  res.json({ runs: store.getPipelineRuns() });
});

module.exports = router;
