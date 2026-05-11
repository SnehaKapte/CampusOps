import React, { useState, useEffect } from 'react';
import { alertsAPI } from '../services/api';
import { PageHeader, AlertItem, Loader, Card } from '../components/Components';
import { toast } from 'react-toastify';

export default function Alerts() {
  const [alerts, setAlerts]   = useState([]);
  const [filter, setFilter]   = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const params = {};
        if (filter === 'open')     params.resolved = false;
        if (filter === 'resolved') params.resolved = true;
        const res = await alertsAPI.getAll(params);
        setAlerts(res.data.alerts);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadAlerts();
  }, [filter]);

  const resolveAlert = async (id) => {
    try {
      await alertsAPI.resolve(id);
      setAlerts(prev => prev.map(a => a._id === id ? { ...a, resolved: true } : a));
      toast.success('Alert resolved');
    } catch { toast.error('Failed to resolve alert'); }
  };

  return (
    <div className="animate-fade">
      <PageHeader title="Alerts & Incidents" subtitle={`${alerts.filter(a => !a.resolved).length} active alerts`} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'open', 'resolved'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map(a => <AlertItem key={a._id} alert={a} onResolve={resolveAlert} />)}
            {alerts.length === 0 && <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 32, fontSize: 14 }}>No alerts found</p>}
          </div>
        </Card>
      )}
    </div>
  );
}
