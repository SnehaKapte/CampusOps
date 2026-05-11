import React from 'react';
import './Components.css';

// ── MetricCard ───────────────────────────────────────────
export function MetricCard({
  label,
  value,
  unit = '',
  trend,
  trendText,
  color = 'default',
}) {
  const trendUp = trend === 'up';

  return (
    <div className={`metric-card metric-card--${color}`}>
      <div className="metric-label">{label}</div>

      <div className="metric-value">
        {value}
        <span className="metric-unit">{unit}</span>
      </div>

      {trendText && (
        <div className="metric-trend trend-up">
          <span className="trend-arrow">
            {trendUp ? '↑' : '↓'}
          </span>{' '}
          
          <span className="trend-text">
            {trendText}
          </span>
        </div>
      )}
    </div>
  );
}

// ── StatusBadge ──────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    up:        { label: 'Operational', cls: 'badge-success' },
    warning:   { label: 'Warning',     cls: 'badge-warning' },
    down:      { label: 'Down',        cls: 'badge-danger'  },
    offline:   { label: 'Offline',     cls: 'badge-danger'  },
    normal:    { label: 'Normal',      cls: 'badge-success' },
    success:   { label: 'Success',     cls: 'badge-success' },
    failed:    { label: 'Failed',      cls: 'badge-danger'  },
    running:   { label: 'Running',     cls: 'badge-info'    },
    skipped:   { label: 'Skipped',     cls: 'badge-muted'   },
    pending:   { label: 'Pending',     cls: 'badge-muted'   },
    partial:   { label: 'Partial',     cls: 'badge-warning' },
    active:    { label: 'Active',      cls: 'badge-success' },
    healthy:   { label: 'Healthy',     cls: 'badge-success' },
    degraded:  { label: 'Degraded',    cls: 'badge-warning' },
  };
  const s = map[status?.toLowerCase()] || { label: status || '—', cls: 'badge-muted' };
  return <span className={`status-badge ${s.cls}`}>{s.label}</span>;
}

// ── ProgressBar ──────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'success', size = 'md', label, showPct = false }) {
  const pct = Math.round((value / max) * 100);
  const autoColor = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : color;
  return (
    <div className="progress-wrap">
      {(label || showPct) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showPct && <span className="progress-pct">{pct}%</span>}
        </div>
      )}
      <div className={`progress-bar progress-bar--${size}`}>
        <div className={`progress-fill fill-${autoColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

// ── SectionHeader ────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="section-header">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────
export function Card({ children, className = '', style }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
}

// ── AlertItem ────────────────────────────────────────────
export function AlertItem({ alert, onResolve }) {
  const severityColor = { critical: 'danger', warning: 'warning', info: 'info' };
  const color = severityColor[alert.severity] || 'muted';

  return (
    <div className={`alert-item alert-item--${color} ${alert.resolved ? 'alert-resolved' : ''}`}>
      <span className={`alert-dot dot-${color}`}></span>
      <div className="alert-body">
        <div className="alert-title">{alert.title}</div>
        <div className="alert-msg">{alert.message}</div>
        <div className="alert-meta">
          {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {alert.resolved && <span className="alert-resolved-tag">· Resolved</span>}
        </div>
      </div>
      {!alert.resolved && onResolve && (
        <button className="btn btn-xs btn-outline" onClick={() => onResolve(alert._id)}>Resolve</button>
      )}
    </div>
  );
}

// ── LoadingSpinner ───────────────────────────────────────
export function Loader() {
  return (
    <div className="loader-wrap">
      <div className="loader-ring">
        <div /><div /><div /><div />
      </div>
      <span>Loading...</span>
    </div>
  );
}

// ── PageHeader ───────────────────────────────────────────
export function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
  );
}
