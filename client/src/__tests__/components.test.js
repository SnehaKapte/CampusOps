import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetricCard, StatusBadge, ProgressBar, AlertItem } from '../components/Components';

// ── MetricCard ───────────────────────────────────────────
describe('MetricCard', () => {
  test('renders label and value', () => {
    render(<MetricCard label="Energy Consumption" value={847} unit=" kWh" />);
    expect(screen.getByText('Energy Consumption')).toBeInTheDocument();
    expect(screen.getByText(/847/)).toBeInTheDocument();
    expect(screen.getByText('kWh')).toBeInTheDocument();
  });

  test('renders trend text', () => {
    render(<MetricCard label="Test" value={99} trend="up" trendText="+5% this week" />);
    // trend arrow and text may be in same element — use container query
    const trendEl = document.querySelector('.metric-trend');
    expect(trendEl).not.toBeNull();
    expect(trendEl.textContent).toContain('+5% this week');
  });

  test('renders without trend', () => {
    render(<MetricCard label="Test" value={42} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.queryByText('undefined')).not.toBeInTheDocument();
  });

  test('applies color class correctly', () => {
    const { container } = render(<MetricCard label="Test" value={1} color="danger" />);
    expect(container.firstChild).toHaveClass('metric-card--danger');
  });
});

// ── StatusBadge ──────────────────────────────────────────
describe('StatusBadge', () => {
  test('renders "Operational" for status up', () => {
    render(<StatusBadge status="up" />);
    expect(screen.getByText('Operational')).toBeInTheDocument();
  });

  test('renders "Warning" for status warning', () => {
    render(<StatusBadge status="warning" />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  test('renders "Down" for status down', () => {
    render(<StatusBadge status="down" />);
    expect(screen.getByText('Down')).toBeInTheDocument();
  });

  test('renders "Running" for status running', () => {
    render(<StatusBadge status="running" />);
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  test('handles unknown status gracefully', () => {
    render(<StatusBadge status="unknown_xyz" />);
    expect(screen.getByText('unknown_xyz')).toBeInTheDocument();
  });

  test('handles null status', () => {
    render(<StatusBadge status={null} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});

// ── ProgressBar ──────────────────────────────────────────
describe('ProgressBar', () => {
  test('renders with label', () => {
    render(<ProgressBar label="CPU Load" value={63} />);
    expect(screen.getByText('CPU Load')).toBeInTheDocument();
  });

  test('shows percentage when showPct is true', () => {
    render(<ProgressBar label="Usage" value={75} showPct />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('does not show percentage when showPct is false', () => {
    render(<ProgressBar label="Test" value={50} showPct={false} />);
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  test('clamps value to 100%', () => {
    const { container } = render(<ProgressBar value={150} />);
    const fill = container.querySelector('.progress-fill');
    expect(fill).toBeDefined();
  });
});

// ── AlertItem ────────────────────────────────────────────
describe('AlertItem', () => {
  const mockAlert = {
    _id: '1',
    severity: 'critical',
    title: 'HVAC Offline',
    message: 'Zone H3 not responding',
    resolved: false,
    createdAt: new Date().toISOString()
  };

  test('renders alert title and message', () => {
    render(<AlertItem alert={mockAlert} />);
    expect(screen.getByText('HVAC Offline')).toBeInTheDocument();
    expect(screen.getByText('Zone H3 not responding')).toBeInTheDocument();
  });

  test('renders resolve button for unresolved alerts', () => {
    const onResolve = jest.fn();
    render(<AlertItem alert={mockAlert} onResolve={onResolve} />);
    expect(screen.getByText('Resolve')).toBeInTheDocument();
  });

  test('does not render resolve button when no handler', () => {
    render(<AlertItem alert={mockAlert} />);
    expect(screen.queryByText('Resolve')).not.toBeInTheDocument();
  });

  test('shows "Resolved" label for resolved alerts', () => {
    const resolved = { ...mockAlert, resolved: true };
    render(<AlertItem alert={resolved} />);
    expect(screen.getByText('· Resolved')).toBeInTheDocument();
  });

  test('applies resolved styling class', () => {
    const resolved = { ...mockAlert, resolved: true };
    const { container } = render(<AlertItem alert={resolved} />);
    expect(container.firstChild).toHaveClass('alert-resolved');
  });
});
