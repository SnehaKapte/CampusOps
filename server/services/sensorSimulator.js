const EventEmitter = require('events');

class SensorSimulator extends EventEmitter {
  constructor() {
    super();
    this.interval = null;
    this.alertInterval = null;

    // Baseline values with realistic variance
    this.state = {
      energy:      { value: 847, trend: -1 },
      serverLoad:  { value: 63,  trend: 1  },
      networkUtil: { value: 71,  trend: 0  },
      temperature: { value: 22,  trend: 0  },
      uptime:      { value: 99.8 },
    };
  }

  // Simulate sensor drift
  drift(current, min, max, speed = 0.5) {
    const delta = (Math.random() - 0.48) * speed;
    return Math.max(min, Math.min(max, +(current + delta).toFixed(1)));
  }

  generateMetrics() {
    this.state.energy.value      = this.drift(this.state.energy.value, 700, 1100, 8);
    this.state.serverLoad.value  = this.drift(this.state.serverLoad.value, 20, 95, 2);
    this.state.networkUtil.value = this.drift(this.state.networkUtil.value, 40, 90, 1.5);
    this.state.temperature.value = this.drift(this.state.temperature.value, 18, 30, 0.3);

    const hour = new Date().getHours();
    const energyHistory = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      value: Math.round(600 + Math.sin((i - 6) * Math.PI / 12) * 300 + Math.random() * 50)
    }));

    return {
      energy: {
        current:     Math.round(this.state.energy.value),
        unit:        'kWh',
        trend:       this.state.energy.value < 900 ? 'down' : 'up',
        trendPct:    12,
        history:     energyHistory,
        solar:       Math.round(this.state.energy.value * 0.18),
        grid:        Math.round(this.state.energy.value * 0.82),
      },
      server: {
        cpu:         Math.round(this.state.serverLoad.value),
        memory:      Math.round(55 + Math.random() * 20),
        disk:        68,
        requests:    Math.round(1200 + Math.random() * 400),
      },
      network: {
        bandwidth:   Math.round(this.state.networkUtil.value),
        latency:     Math.round(12 + Math.random() * 8),
        packetsIn:   Math.round(45000 + Math.random() * 10000),
        packetsOut:  Math.round(38000 + Math.random() * 8000),
        wifiClients: Math.round(320 + Math.random() * 80),
      },
      hvac: {
        zones:       20,
        online:      18,
        avgTemp:     +this.state.temperature.value.toFixed(1),
        setpoint:    22,
      },
      security: {
        cameras:     { online: 142, total: 148 },
        accessPoints: { online: 24, total: 24 },
        incidents:   0,
      },
      uptime:        +(99.5 + Math.random() * 0.5).toFixed(2),
      activeServices: Math.random() > 0.95 ? 23 : 24,
      totalServices:  26,
      alertsToday:    7,
    };
  }

  start(metricsInterval = 4000, alertCheckInterval = 30000) {
    console.log('[Simulator] Sensor simulator started');

    this.interval = setInterval(() => {
      const metrics = this.generateMetrics();
      this.emit('metrics:update', metrics);
    }, metricsInterval);

    // Randomly generate alerts
    this.alertInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const alerts = [
          { severity: 'warning', title: 'High CPU Usage Detected',    message: 'Server node api-02 CPU at 89%', nodeId: 'server-api02' },
          { severity: 'info',    title: 'Scheduled Maintenance Due',   message: 'HVAC filter replacement in Zone A2', nodeId: 'hvac-a2' },
          { severity: 'warning', title: 'Disk Space Warning',          message: 'MongoDB server at 78% capacity', nodeId: 'db-01' },
          { severity: 'info',    title: 'Backup Completed Successfully', message: 'Daily database backup at 03:00 finished', nodeId: 'backup' },
        ];
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        this.emit('alert:new', { ...alert, resolved: false, createdAt: new Date().toISOString() });
      }
    }, alertCheckInterval);
  }

  stop() {
    if (this.interval)      clearInterval(this.interval);
    if (this.alertInterval) clearInterval(this.alertInterval);
    console.log('[Simulator] Sensor simulator stopped');
  }
}

module.exports = SensorSimulator;
