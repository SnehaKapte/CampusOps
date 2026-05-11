import React, { useState, useEffect } from 'react';
import { hvacAPI } from '../services/api';
import { PageHeader, MetricCard, Card, Loader, SectionHeader, StatusBadge } from '../components/Components';
import { toast } from 'react-toastify';

export default function HVAC() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => hvacAPI.getAll().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => { loadData(); }, []);

  const updateSetpoint = async (id, sp) => {
    try {
      await hvacAPI.setZone(id, { setpoint: sp });
      toast.success(`Zone ${id.toUpperCase()} setpoint updated to ${sp}°C`);
      loadData();
    } catch { toast.error('Failed to update setpoint'); }
  };

  const statusColor = { normal: '#1D9E75', warning: '#EF9F27', offline: '#E24B4A' };

  if (loading) return <Loader />;

  return (
    <div className="animate-fade">
      <PageHeader title="HVAC & Climate Control" subtitle="Zone temperature monitoring and control" />
      <div className="metrics-grid">
        <MetricCard label="Total Zones"  value={data?.summary?.total}  color="info"    />
        <MetricCard label="Online"       value={data?.summary?.online}  color="success" />
        <MetricCard label="Offline"      value={data?.summary?.offline} color="danger"  />
        <MetricCard label="Avg Setpoint" value="22" unit="°C"           color="success" />
      </div>

      <SectionHeader title="Zone Status" />
      <div className="cards-grid">
        {(data?.zones || []).map(zone => (
          <Card key={zone.id} style={{ borderLeft: `3px solid ${statusColor[zone.status] || '#9ca3af'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{zone.name}</span>
              <StatusBadge status={zone.status} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>Current Temp</div>
                <div style={{ fontWeight: 700, fontSize: 22, color: zone.temp > zone.setpoint + 2 ? 'var(--color-danger)' : 'var(--color-text)' }}>{zone.temp}°C</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>Humidity</div>
                <div style={{ fontWeight: 700, fontSize: 22 }}>{zone.humidity}%</div>
              </div>
            </div>
            {zone.status !== 'offline' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Setpoint:</span>
                <select
                  value={zone.setpoint}
                  onChange={e => updateSetpoint(zone.id, Number(e.target.value))}
                  style={{ padding: '3px 6px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 12, background: 'var(--color-surface)' }}
                >
                  {[18,19,20,21,22,23,24,25,26,27,28].map(t => <option key={t} value={t}>{t}°C</option>)}
                </select>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
