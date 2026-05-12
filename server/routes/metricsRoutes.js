const express = require("express");
const router = express.Router();

let register = null;
let gauges = {};

try {
  const client = require("prom-client");
  register = new client.Registry();
  client.collectDefaultMetrics({ register });

  gauges.energy = new client.Gauge({ name: "campusops_energy_kwh", help: "Energy kWh", registers: [register] });
  gauges.cpu    = new client.Gauge({ name: "campusops_cpu_percent", help: "CPU %", registers: [register] });
  gauges.mem    = new client.Gauge({ name: "campusops_memory_percent", help: "Memory %", registers: [register] });
  gauges.svc    = new client.Gauge({ name: "campusops_services_online", help: "Services online", registers: [register] });
  gauges.alerts = new client.Gauge({ name: "campusops_alerts_open", help: "Open alerts", registers: [register] });
} catch (e) { register = null; }

const rand = (base, variance) => +(base + (Math.random() - 0.5) * variance).toFixed(1);

router.get("/", async (req, res) => {
  const energy   = Math.round(rand(847, 80));
  const cpu      = Math.round(rand(63, 10));
  const memory   = Math.round(rand(58, 10));

  if (register) {
    gauges.energy && gauges.energy.set(energy);
    gauges.cpu    && gauges.cpu.set(cpu);
    gauges.mem    && gauges.mem.set(memory);
    gauges.svc    && gauges.svc.set(24);
    gauges.alerts && gauges.alerts.set(4);
  }

  // Prometheus scraper sends Accept: text/plain
  const accept = req.headers["accept"] || "";
  if (accept.includes("text/plain") && register) {
    res.set("Content-Type", register.contentType);
    return res.end(await register.metrics());
  }

  // JSON for frontend and Jest tests
  return res.json({
    energy:         { current: energy, unit: "kWh", trend: "down", trendPct: 12 },
    networkUptime:  { value: +rand(99.8, 0.2).toFixed(1), unit: "%" },
    activeServices: { online: 24, total: 26 },
    serverLoad:     { cpu, memory },
    hvacZones:      { online: 18, total: 20 },
    alertsToday:    { total: 7, resolved: 3, open: 4 },
    timestamp:      new Date().toISOString()
  });
});

module.exports = router;
