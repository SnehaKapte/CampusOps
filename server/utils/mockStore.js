// In-memory mock data store for development without MongoDB

const mockAlerts = [
  { _id: '1', severity: 'critical', title: 'Hostel Block HVAC Offline', message: 'Zone H3 HVAC system is not responding', nodeId: 'hvac-h3', resolved: false, createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { _id: '2', severity: 'warning',  title: 'Bandwidth Utilization High', message: 'Core Switch SW-07 at 78% capacity', nodeId: 'net-sw07', resolved: false, createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
  { _id: '3', severity: 'info',     title: 'Jenkins Build #47 Passed', message: 'Deploy to staging successful', nodeId: 'cicd', resolved: true, createdAt: new Date(Date.now() - 90 * 60000).toISOString() },
  { _id: '4', severity: 'warning',  title: '6 CCTV Cameras Offline', message: 'Lab Block cameras unresponsive', nodeId: 'sec-cctv', resolved: false, createdAt: new Date(Date.now() - 120 * 60000).toISOString() },
  { _id: '5', severity: 'info',     title: 'Ansible Playbook Deployed', message: '5 nodes updated, Nginx reloaded', nodeId: 'deploy', resolved: true, createdAt: new Date(Date.now() - 180 * 60000).toISOString() },
];

const mockServices = [
  { _id: '1', name: 'Energy Monitor',   status: 'up',      uptime: 99.9, load: 40, lastChecked: new Date().toISOString() },
  { _id: '2', name: 'HVAC Control',     status: 'warning', uptime: 97.1, load: 72, lastChecked: new Date().toISOString() },
  { _id: '3', name: 'Network Manager',  status: 'up',      uptime: 99.8, load: 55, lastChecked: new Date().toISOString() },
  { _id: '4', name: 'CCTV Stream',      status: 'warning', uptime: 96.2, load: 88, lastChecked: new Date().toISOString() },
  { _id: '5', name: 'Access Control',   status: 'up',      uptime: 100,  load: 28, lastChecked: new Date().toISOString() },
  { _id: '6', name: 'DB Cluster',       status: 'up',      uptime: 99.7, load: 63, lastChecked: new Date().toISOString() },
  { _id: '7', name: 'Auth Service',     status: 'up',      uptime: 99.9, load: 35, lastChecked: new Date().toISOString() },
  { _id: '8', name: 'Alert Engine',     status: 'up',      uptime: 98.5, load: 45, lastChecked: new Date().toISOString() },
  { _id: '9', name: 'Report Service',   status: 'up',      uptime: 99.1, load: 22, lastChecked: new Date().toISOString() },
  { _id: '10', name: 'Sensor Gateway',  status: 'up',      uptime: 99.6, load: 51, lastChecked: new Date().toISOString() },
];

const mockPipelineRuns = [
  {
    _id: '1',
    buildNumber: 47,
    branch: 'main',
    commit: 'a3f8b91',
    status: 'success',
    duration: '5m 32s',
    triggeredBy: 'SCM Push',
    createdAt: new Date(Date.now() - 65 * 60000).toISOString(),
    stages: [
      { name: 'Checkout',              status: 'success', duration: '8s'  },
      { name: 'Install Dependencies',  status: 'success', duration: '44s' },
      { name: 'Lint & Audit',          status: 'success', duration: '18s' },
      { name: 'Unit Tests',            status: 'success', duration: '52s' },
      { name: 'E2E Tests (Selenium)',  status: 'success', duration: '1m 58s' },
      { name: 'Build Docker Images',   status: 'success', duration: '58s' },
      { name: 'Deploy Staging',        status: 'success', duration: '28s' },
      { name: 'Smoke Tests',           status: 'success', duration: '9s'  },
      { name: 'Deploy Production',     status: 'running', duration: '--'  },
    ],
    testResults: { total: 119, passed: 119, failed: 0, coverage: 87 }
  },
  {
    _id: '2',
    buildNumber: 46,
    branch: 'main',
    commit: 'c7d4e22',
    status: 'success',
    duration: '5m 18s',
    triggeredBy: 'Manual',
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    stages: [
      { name: 'Checkout',              status: 'success', duration: '7s'  },
      { name: 'Install Dependencies',  status: 'success', duration: '41s' },
      { name: 'Lint & Audit',          status: 'success', duration: '16s' },
      { name: 'Unit Tests',            status: 'success', duration: '48s' },
      { name: 'E2E Tests (Selenium)',  status: 'success', duration: '1m 52s' },
      { name: 'Build Docker Images',   status: 'success', duration: '54s' },
      { name: 'Deploy Staging',        status: 'success', duration: '25s' },
      { name: 'Smoke Tests',           status: 'success', duration: '8s'  },
      { name: 'Deploy Production',     status: 'success', duration: '26s' },
    ],
    testResults: { total: 117, passed: 117, failed: 0, coverage: 86 }
  },
  {
    _id: '3',
    buildNumber: 45,
    branch: 'develop',
    commit: 'e9a1f33',
    status: 'failed',
    duration: '3m 12s',
    triggeredBy: 'SCM Push',
    createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
    stages: [
      { name: 'Checkout',              status: 'success', duration: '8s'   },
      { name: 'Install Dependencies',  status: 'success', duration: '43s'  },
      { name: 'Lint & Audit',          status: 'success', duration: '17s'  },
      { name: 'Unit Tests',            status: 'failed',  duration: '1m 4s' },
      { name: 'E2E Tests (Selenium)',  status: 'skipped', duration: '--'    },
      { name: 'Build Docker Images',   status: 'skipped', duration: '--'    },
      { name: 'Deploy Staging',        status: 'skipped', duration: '--'    },
      { name: 'Smoke Tests',           status: 'skipped', duration: '--'    },
      { name: 'Deploy Production',     status: 'skipped', duration: '--'    },
    ],
    testResults: { total: 119, passed: 112, failed: 7, coverage: 84 }
  }
];

let alertIdCounter = mockAlerts.length + 1;

const store = {
  getAlerts: () => [...mockAlerts],
  getAlertById: (id) => mockAlerts.find(a => a._id === id),
  resolveAlert: (id) => {
    const a = mockAlerts.find(x => x._id === id);
    if (a) { a.resolved = true; a.resolvedAt = new Date().toISOString(); }
    return a;
  },
  addAlert: (alert) => {
    const newAlert = { _id: String(alertIdCounter++), ...alert, createdAt: new Date().toISOString() };
    mockAlerts.unshift(newAlert);
    return newAlert;
  },
  getServices: () => [...mockServices],
  getPipelineRuns: () => [...mockPipelineRuns],
  getLatestPipelineRun: () => mockPipelineRuns[0],
};

module.exports = store;
