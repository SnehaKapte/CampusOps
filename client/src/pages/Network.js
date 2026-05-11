// Network.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import { networkAPI } from '../services/api';
import { PageHeader, MetricCard, Card, Loader, SectionHeader, ProgressBar } from '../components/Components';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function Network() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    networkAPI.getAll().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
    const t = setInterval(() => networkAPI.getAll().then(r => setData(r.data)).catch(() => {}), 8000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <Loader />;

  const chartData = {
    labels: data?.history?.map(h => h.hour) || [],
    datasets: [{
      label: 'Bandwidth %', data: data?.history?.map(h => h.usage) || [],
      borderColor: '#378ADD', backgroundColor: 'rgba(55,138,221,0.08)',
      borderWidth: 1.5, pointRadius: 0, fill: true, tension: 0.4
    }]
  };

  return (
    <div className="animate-fade">
      <PageHeader title="Network Infrastructure" subtitle="Campus network health and performance monitoring" />
      <div className="metrics-grid">
        <MetricCard label="Bandwidth Usage" value={data?.bandwidth?.usage} unit="%" color="info"    />
        <MetricCard label="Latency"         value={data?.latency}          unit="ms" color="success" />
        <MetricCard label="Uptime"          value={data?.uptime}           unit="%" color="success" />
        <MetricCard label="WiFi Clients"    value={data?.wifiClients}                color="info"    />
        <MetricCard label="Threats Blocked" value={data?.threatsBlocked || 0}       color="warning" />
        <MetricCard label="Firewall Rules"  value={data?.firewallRules || 142}       color="success" />
      </div>

      <div className="two-col" style={{ marginBottom: 16 }}>
        <Card>
          <SectionHeader title="Network Status" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ProgressBar label="Core Switches" value={data?.coreSwitches?.online} max={data?.coreSwitches?.total} showPct />
            <ProgressBar label="WiFi APs Online" value={data?.wifiAPs?.online} max={data?.wifiAPs?.total} showPct />
            <ProgressBar label="Bandwidth Utilization" value={data?.bandwidth?.usage} showPct />
          </div>
        </Card>
        <Card>
          <SectionHeader title="Bandwidth (24h)" />
          <div style={{ height: 140 }}>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#9ca3af', maxTicksLimit: 8 } }, y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%', font: { size: 10 }, color: '#9ca3af' } } } }} />
          </div>
        </Card>
      </div>
    </div>
  );
}
