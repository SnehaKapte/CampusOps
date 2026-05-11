import React, { useState, useEffect } from 'react';
import { securityAPI } from '../services/api';
import { PageHeader, MetricCard, Card, Loader, SectionHeader, ProgressBar, StatusBadge } from '../components/Components';

export default function Security() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    securityAPI.getAll().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="animate-fade">
      <PageHeader title="Security Systems" subtitle="Campus surveillance and access control monitoring" />
      <div className="metrics-grid">
        <MetricCard label="CCTV Online"    value={`${data?.cctv?.online}/${data?.cctv?.total}`}                     color="success" />
        <MetricCard label="Access Points"  value={`${data?.accessControl?.online}/${data?.accessControl?.total}`}   color="success" />
        <MetricCard label="Active Cards"   value={data?.accessControl?.activeCards}                                  color="info"    />
        <MetricCard label="Incidents Today" value={data?.incidents?.today || 0}                                     color="success" />
      </div>

      <div className="two-col">
        <Card>
          <SectionHeader title="System Status" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ProgressBar label="CCTV Coverage" value={data?.cctv?.online} max={data?.cctv?.total} showPct />
            <ProgressBar label="Access Control" value={data?.accessControl?.online} max={data?.accessControl?.total} showPct />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12 }}>Intrusion Detection</span>
              <StatusBadge status={data?.intrusionDet?.status || 'active'} />
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Recent Events" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(data?.recentEvents || []).map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12 }}>
                <span style={{ color: 'var(--color-text-muted)', minWidth: 40, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                <span style={{ color: ev.type === 'alert' ? 'var(--color-danger)' : 'var(--color-text)' }}>{ev.msg}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
