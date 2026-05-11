const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const energyRoutes = require('./routes/energyRoutes');
const hvacRoutes = require('./routes/hvacRoutes');
const networkRoutes = require('./routes/networkRoutes');
const securityRoutes = require('./routes/securityRoutes');
const alertRoutes = require('./routes/alertRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const pipelineRoutes = require('./routes/pipelineRoutes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security Middleware ──────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// ── Rate Limiting ────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Routes ───────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/metrics',  metricsRoutes);
app.use('/api/energy',   energyRoutes);
app.use('/api/hvac',     hvacRoutes);
app.use('/api/network',  networkRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/alerts',   alertRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/pipeline', pipelineRoutes);

// ── Health Check ─────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CampusOps API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// ── Error Handler ────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
