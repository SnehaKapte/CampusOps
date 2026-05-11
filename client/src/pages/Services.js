import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../services/api';
import { PageHeader, Card, Loader, SectionHeader, StatusBadge, MetricCard } from '../components/Components';

export default function Services() {
  const [data, setData]       = useState([]);
  const [health, setHealth]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([servicesAPI.getAll(), servicesAPI.getHealth()])
      .then(([sRes, hRes]) => { setData(sRes.data.services); setHealth(hRes.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const up = data.filter(s => s.status === 'up').length;
  const warn = data.filter(s => s.status === 'warning').length;

  return (
    <div className="animate-fade">
      <PageHeader title="Service Health Monitor" subtitle="All campus platform services status and performance" />
      <div className="metrics-grid">
        <MetricCard label="Total Services"   value={data.length}  color="info"    />
        <MetricCard label="Operational"      value={up}           color="success" />
        <MetricCard label="Degraded"         value={warn}         color="warning" />
        <MetricCard label="Platform Health"  value={health?.status === 'healthy' ? '100' : '92'} unit="%" color={health?.status === 'healthy' ? 'success' : 'warning'} />
      </div>

      <Card>
        <SectionHeader title="All Services" />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Service', 'Status', 'Uptime', 'Load', 'Last Checked'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((svc, i) => (
              <tr key={svc._id} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--color-bg)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{svc.name}</td>
                <td style={{ padding: '10px 12px' }}><StatusBadge status={svc.status} /></td>
                <td style={{ padding: '10px 12px', fontVariantNumeric: 'tabular-nums' }}>{svc.uptime}%</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 4, background: 'var(--color-bg)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${svc.load}%`, background: svc.load > 80 ? 'var(--color-danger)' : svc.load > 60 ? 'var(--color-warning)' : 'var(--color-success)', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11 }}>{svc.load}%</span>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)', fontSize: 12 }}>
                  {new Date(svc.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
