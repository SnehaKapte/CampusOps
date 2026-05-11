require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');
const app = require('./app');
const { connectDB } = require('./utils/database');
const SensorSimulator = require('./services/sensorSimulator');

const PORT = process.env.PORT || 5000;

// ── HTTP Server ──────────────────────────────────────────
const server = http.createServer(app);

// ── WebSocket Server ─────────────────────────────────────
const wss = new WebSocket.Server({ server, path: '/ws' });

const clients = new Set();

wss.on('connection', (ws, req) => {
  clients.add(ws);
  console.log(`[WS] Client connected. Total: ${clients.size}`);

  // Send initial data snapshot
  ws.send(JSON.stringify({
    type: 'CONNECTED',
    message: 'Connected to CampusOps WebSocket',
    timestamp: new Date().toISOString()
  }));

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected. Total: ${clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('[WS] Error:', err.message);
    clients.delete(ws);
  });
});

// Broadcast to all connected clients
const broadcast = (type, data) => {
  const message = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// ── Sensor Simulator ─────────────────────────────────────
const simulator = new SensorSimulator();

simulator.on('metrics:update', (data) => broadcast('METRICS_UPDATE', data));
simulator.on('alert:new',      (data) => broadcast('ALERT_NEW', data));
simulator.on('service:update', (data) => broadcast('SERVICE_UPDATE', data));

simulator.start();

// ── Start Server ─────────────────────────────────────────
const startServer = async () => {
  try {
    if (process.env.USE_MOCK_DATA !== 'true') {
      await connectDB();
    } else {
      console.log('[DB] Running with mock data (USE_MOCK_DATA=true)');
    }

    server.listen(PORT, () => {
      console.log(`\n🚀 CampusOps Server running at http://localhost:${PORT}`);
      console.log(`📡 WebSocket available at  ws://localhost:${PORT}/ws`);
      console.log(`🩺 Health check:           http://localhost:${PORT}/health`);
      console.log(`📊 API base:               http://localhost:${PORT}/api`);
      console.log(`\nMode: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = { server, wss, broadcast };
