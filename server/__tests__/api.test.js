/**
 * CampusOps — Server API Tests
 * Run: npm test (from /server directory)
 * Uses: Jest + Supertest
 */

const request = require('supertest');
const app     = require('../app');

// ── Auth Tests ──────────────────────────────────────────
describe('POST /api/auth/login', () => {
  test('returns JWT token with valid admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('admin');
  });

  test('returns JWT token for operator user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'operator', password: 'op123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('returns 401 with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  test('returns 401 with non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'ghost', password: 'test123' });

    expect(res.status).toBe(401);
  });

  test('returns 400 if username missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'admin123' });

    expect(res.status).toBe(400);
  });

  test('returns 400 if password missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin' });

    expect(res.status).toBe(400);
  });
});

// ── Health Check ────────────────────────────────────────
describe('GET /health', () => {
  test('returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('CampusOps API');
    expect(res.body.timestamp).toBeDefined();
  });
});

// ── Metrics Tests ───────────────────────────────────────
describe('GET /api/metrics', () => {
  test('returns all metric categories', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('energy');
    expect(res.body).toHaveProperty('networkUptime');
    expect(res.body).toHaveProperty('activeServices');
    expect(res.body).toHaveProperty('serverLoad');
    expect(res.body).toHaveProperty('hvacZones');
    expect(res.body).toHaveProperty('alertsToday');
    expect(res.body).toHaveProperty('timestamp');
  });

  test('energy value is within realistic range', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.body.energy.current).toBeGreaterThan(400);
    expect(res.body.energy.current).toBeLessThan(1500);
  });

  test('server load CPU is a percentage (0–100)', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.body.serverLoad.cpu).toBeGreaterThanOrEqual(0);
    expect(res.body.serverLoad.cpu).toBeLessThanOrEqual(100);
  });
});

// ── Energy Tests ────────────────────────────────────────
describe('GET /api/energy', () => {
  test('returns energy data with history', async () => {
    const res = await request(app).get('/api/energy');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('current');
    expect(res.body).toHaveProperty('solar');
    expect(res.body).toHaveProperty('grid');
    expect(res.body).toHaveProperty('history');
    expect(Array.isArray(res.body.history)).toBe(true);
    expect(res.body.history).toHaveLength(7);
  });

  test('history items have day, actual, target fields', async () => {
    const res = await request(app).get('/api/energy');
    const item = res.body.history[0];
    expect(item).toHaveProperty('day');
    expect(item).toHaveProperty('actual');
    expect(item).toHaveProperty('target');
  });
});

// ── HVAC Tests ──────────────────────────────────────────
describe('GET /api/hvac', () => {
  test('returns zones array and summary', async () => {
    const res = await request(app).get('/api/hvac');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.zones)).toBe(true);
    expect(res.body.zones.length).toBeGreaterThan(0);
    expect(res.body.summary).toHaveProperty('total');
    expect(res.body.summary).toHaveProperty('online');
  });

  test('can fetch individual zone by id', async () => {
    const res = await request(app).get('/api/hvac/a1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('a1');
    expect(res.body).toHaveProperty('temp');
    expect(res.body).toHaveProperty('setpoint');
    expect(res.body).toHaveProperty('status');
  });

  test('returns 404 for unknown zone', async () => {
    const res = await request(app).get('/api/hvac/unknown999');
    expect(res.status).toBe(404);
  });

  test('can update zone setpoint', async () => {
    const res = await request(app)
      .patch('/api/hvac/a1')
      .send({ setpoint: 23 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.zone.setpoint).toBe(23);
  });
});

// ── Network Tests ───────────────────────────────────────
describe('GET /api/network', () => {
  test('returns network metrics', async () => {
    const res = await request(app).get('/api/network');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('bandwidth');
    expect(res.body).toHaveProperty('latency');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('wifiClients');
  });

  test('history has 24 hourly entries', async () => {
    const res = await request(app).get('/api/network');
    expect(res.body.history).toHaveLength(24);
  });
});

// ── Security Tests ──────────────────────────────────────
describe('GET /api/security', () => {
  test('returns security system data', async () => {
    const res = await request(app).get('/api/security');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('cctv');
    expect(res.body).toHaveProperty('accessControl');
    expect(res.body).toHaveProperty('incidents');
    expect(res.body.cctv.total).toBe(148);
  });
});

// ── Alert Tests ─────────────────────────────────────────
describe('GET /api/alerts', () => {
  test('returns alerts list', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('alerts');
    expect(Array.isArray(res.body.alerts)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('can filter alerts by resolved=false', async () => {
    const res = await request(app).get('/api/alerts?resolved=false');
    expect(res.status).toBe(200);
    res.body.alerts.forEach(a => expect(a.resolved).toBe(false));
  });

  test('can filter alerts by severity', async () => {
    const res = await request(app).get('/api/alerts?severity=critical');
    expect(res.status).toBe(200);
    res.body.alerts.forEach(a => expect(a.severity).toBe('critical'));
  });

  test('can resolve an alert', async () => {
    const res = await request(app).post('/api/alerts/1/resolve');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.alert.resolved).toBe(true);
  });

  test('returns 404 for unknown alert', async () => {
    const res = await request(app).get('/api/alerts/nonexistent');
    expect(res.status).toBe(404);
  });
});

// ── Services Tests ──────────────────────────────────────
describe('GET /api/services', () => {
  test('returns services list', async () => {
    const res = await request(app).get('/api/services');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.services)).toBe(true);
    expect(res.body.services.length).toBeGreaterThan(5);
  });

  test('health endpoint returns status', async () => {
    const res = await request(app).get('/api/services/health');
    expect(res.status).toBe(200);
    expect(['healthy', 'degraded']).toContain(res.body.status);
    expect(res.body.timestamp).toBeDefined();
  });
});

// ── Pipeline Tests ──────────────────────────────────────
describe('GET /api/pipeline', () => {
  test('returns latest pipeline run status', async () => {
    const res = await request(app).get('/api/pipeline/status');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('buildNumber');
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('stages');
    expect(Array.isArray(res.body.stages)).toBe(true);
    expect(res.body.stages.length).toBe(9);
  });

  test('pipeline stages have name, status, duration', async () => {
    const res = await request(app).get('/api/pipeline/status');
    const stage = res.body.stages[0];
    expect(stage).toHaveProperty('name');
    expect(stage).toHaveProperty('status');
    expect(stage).toHaveProperty('duration');
  });

  test('returns all pipeline runs', async () => {
    const res = await request(app).get('/api/pipeline/runs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.runs)).toBe(true);
    expect(res.body.runs.length).toBeGreaterThanOrEqual(3);
  });

  test('test results included in pipeline run', async () => {
    const res = await request(app).get('/api/pipeline/status');
    expect(res.body.testResults).toHaveProperty('total');
    expect(res.body.testResults).toHaveProperty('passed');
    expect(res.body.testResults).toHaveProperty('coverage');
  });
});

// ── 404 Tests ───────────────────────────────────────────
describe('404 handler', () => {
  test('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.status).toBe(404);
  });
});
