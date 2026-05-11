import React, { useState, useEffect, useCallback } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { metricsAPI, alertsAPI } from '../services/api';
import useWebSocket from '../hooks/useWebSocket';
import { MetricCard, StatusBadge, ProgressBar, PageHeader, AlertItem, Loader, Card, SectionHeader } from '../components/Components';
import { toast } from 'react-toastify';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const CHART_OPTIONS = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#9ca3af' } },
    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 }, color: '#9ca3af' } }
  }
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [mRes, aRes] = await Promise.all([metricsAPI.getAll(), alertsAPI.getAll({ limit: 6 })]);
      setMetrics(mRes.data);
      setAlerts(aRes.data.alerts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // WebSocket live updates
  const handleWsMessage = useCallback((msg) => {
    if (msg.type === 'METRICS_UPDATE') setMetrics(prev => ({ ...prev, ...msg.data }));
    if (msg.type === 'ALERT_NEW') {
      setAlerts(prev => [{ ...msg.data, _id: Date.now().toString() }, ...prev.slice(0, 5)]);
      toast.warning(`🔔 New Alert: ${msg.data.title}`, { autoClose: 5000 });
    }
  }, []);
  const { connected } = useWebSocket(handleWsMessage);

  const resolveAlert = async (id) => {
    try {
      await alertsAPI.resolve(id);
      setAlerts(prev => prev.map(a => a._id === id ? { ...a, resolved: true } : a));
      toast.success('Alert resolved');
    } catch { toast.error('Failed to resolve alert'); }
  };

  if (loading) return <Loader />;

  const serverLoadData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'CPU %',
      data: Array.from({ length: 24 }, (_, i) => Math.round(30 + Math.sin((i - 8) * Math.PI / 10) * 25 + Math.random() * 10)),
      borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.08)',
      borderWidth: 1.5, pointRadius: 0, fill: true, tension: 0.4
    }]
  };

  const energyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Actual', data: [920, 870, 910, 847, 830, 760, 800], backgroundColor: '#1D9E75', borderRadius: 4 },
      { label: 'Target', data: [900, 900, 900, 900, 900, 850, 850], backgroundColor: '#dbeafe', borderRadius: 4 }
    ]
  };

  return (
    <div className="animate-fade">
      <PageHeader
        title="Infrastructure Dashboard"
        subtitle={`Live campus overview · WebSocket: ${connected ? '🟢 Connected' : '🔴 Reconnecting...'}`}
      />

      {/* KPI Metrics */}
      <div className="metrics-grid">
        <MetricCard label="Energy Consumption" value={metrics?.energy?.current || 847} unit=" kWh" trend="down" trendText="12% vs yesterday" color="success" />
        <MetricCard label="Network Uptime"      value={metrics?.networkUptime?.value || 99.8} unit="%" trend="up" trendText="+0.1% this week" color="info" />
        <MetricCard label="Active Services"     value={`${metrics?.activeServices?.online || 24}/${metrics?.activeServices?.total || 26}`} trendText="2 degraded" trend="down" color="warning" />
        <MetricCard label="Server CPU Load"     value={metrics?.serverLoad?.cpu || 63} unit="%" trend="up" trendText="Normal range" color="success" />
        <MetricCard label="HVAC Zones Online"   value={`${metrics?.hvacZones?.online || 18}/${metrics?.hvacZones?.total || 20}`} trendText="2 offline" trend="down" color="warning" />
        <MetricCard label="Alerts Today"        value={metrics?.alertsToday?.total || 7} trendText={`${metrics?.alertsToday?.resolved || 3} resolved`} trend="up" color="info" />
      </div>

      {/* Infrastructure Status */}
      <SectionHeader title="Infrastructure Status" />
      <div className="cards-grid" style={{ marginBottom: 24 }}>
        {[
          { title: 'Power Systems', badge: 'up', items: [{ label: 'Main Grid', val: 100 }, { label: 'Solar Panels', val: 87 }, { label: 'Backup Gen', val: 20 }] },
          { title: 'Network',       badge: 'up', items: [{ label: 'Core Switches', val: 99 }, { label: 'WiFi Coverage', val: 94 }, { label: 'Bandwidth', val: 71 }] },
          { title: 'HVAC & Climate', badge: 'warning', items: [{ label: 'Academic Block', val: 90 }, { label: 'Lab Block', val: 55 }, { label: 'Hostel Block', val: 5 }] },
          { title: 'Security',      badge: 'up', items: [{ label: 'CCTV Online', val: 96 }, { label: 'Access Control', val: 100 }, { label: 'Intrusion Det.', val: 100 }] },
        ].map(section => (
          <Card key={section.title}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{section.title}</span>
              <StatusBadge status={section.badge} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.items.map(item => (
                <ProgressBar key={item.label} label={item.label} value={item.val} showPct size="sm" />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts + Alerts */}
      <div className="two-col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <SectionHeader title="Energy Usage (7 days)" />
            <div style={{ height: 180 }}>
              <Bar data={energyData} options={{ ...CHART_OPTIONS, plugins: { legend: { display: true, position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } } } }} />
            </div>
          </Card>
          <Card>
            <SectionHeader title="Server Load (24h)" />
            <div style={{ height: 160 }}>
              <Line data={serverLoadData} options={{ ...CHART_OPTIONS, scales: { ...CHART_OPTIONS.scales, y: { ...CHART_OPTIONS.scales.y, min: 0, max: 100, ticks: { callback: v => v + '%', font: { size: 10 }, color: '#9ca3af' } } } }} />
            </div>
          </Card>
        </div>

        <Card>
          <SectionHeader title="Recent Alerts" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map(alert => (
              <AlertItem key={alert._id} alert={alert} onResolve={resolveAlert} />
            ))}
            {alerts.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>No active alerts</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
