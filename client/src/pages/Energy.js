// Energy.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { energyAPI } from '../services/api';
import { PageHeader, MetricCard, Card, Loader, SectionHeader } from '../components/Components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Energy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    energyAPI.getAll().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const chartData = {
    labels: data?.history?.map(h => h.day) || [],
    datasets: [
      { label: 'Actual (kWh)', data: data?.history?.map(h => h.actual) || [], backgroundColor: '#1D9E75', borderRadius: 4 },
      { label: 'Target (kWh)', data: data?.history?.map(h => h.target) || [], backgroundColor: '#dbeafe', borderRadius: 4 }
    ]
  };

  return (
    <div className="animate-fade">
      <PageHeader title="Energy Management" subtitle="Real-time energy monitoring and consumption analytics" />
      <div className="metrics-grid">
        <MetricCard label="Current Usage"   value={data?.current}      unit=" kWh" color="success" />
        <MetricCard label="Solar Output"    value={data?.solar}        unit=" kWh" color="info"    />
        <MetricCard label="Grid Supply"     value={data?.grid}         unit=" kWh" color="warning" />
        <MetricCard label="Solar Health"    value={data?.solarPct}     unit="%"    color="success" />
        <MetricCard label="Monthly Savings" value={data?.savingsThisMonth || '₹48,200'} color="success" />
        <MetricCard label="CO₂ Saved"       value={data?.co2Saved || '1.2 tons'}        color="info"    />
      </div>
      <Card>
        <SectionHeader title="Weekly Energy Usage vs Target" />
        <div style={{ height: 260 }}>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.04)' } } } }} />
        </div>
      </Card>
    </div>
  );
}
