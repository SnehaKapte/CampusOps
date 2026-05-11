import React, { useState, useEffect } from 'react';
import { pipelineAPI } from '../services/api';
import { PageHeader, Card, SectionHeader, StatusBadge, Loader } from '../components/Components';

export default function Pipeline() {
  const [latest, setLatest] = useState(null);
  const [runs, setRuns]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lRes, rRes] = await Promise.all([pipelineAPI.getStatus(), pipelineAPI.getRuns()]);
        setLatest(lRes.data);
        setRuns(rRes.data.runs);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader />;

  const stageColor = (s) => ({
    success: '#16a34a', failed: '#dc2626', running: '#2563eb', skipped: '#9ca3af', pending: '#9ca3af'
  }[s] || '#9ca3af');

  const stageBg = (s) => ({
    success: '#dcfce7', failed: '#fee2e2', running: '#dbeafe', skipped: '#f3f4f6', pending: '#f3f4f6'
  }[s] || '#f3f4f6');

  return (
    <div className="animate-fade">
      <PageHeader title="CI/CD Pipeline" subtitle="Jenkins pipeline status — auto-refreshes every 10 seconds" />

      {/* Latest Build */}
      {latest && (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Build #{latest.buildNumber} — {latest.branch}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 3 }}>
                Commit: {latest.commit} · {latest.triggeredBy} · {latest.duration}
              </div>
            </div>
            <StatusBadge status={latest.status} />
          </div>

          {/* Stage visualization */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {latest.stages.map((stage, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: stageBg(stage.status), color: stageColor(stage.status), border: `1px solid ${stageColor(stage.status)}30` }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: stageColor(stage.status), flexShrink: 0, animation: stage.status === 'running' ? 'pulse 1s infinite' : 'none' }} />
                {stage.name}
                <span style={{ fontWeight: 400, opacity: 0.7 }}>({stage.duration})</span>
              </div>
            ))}
          </div>

          {/* Test results */}
          {latest.testResults && (
            <div style={{ display: 'flex', gap: 20, padding: '12px 14px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', fontSize: 12 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Tests: <strong style={{ color: '#166534' }}>{latest.testResults.passed} passed</strong> / <strong style={{ color: latest.testResults.failed > 0 ? '#991b1b' : 'inherit' }}>{latest.testResults.failed} failed</strong></span>
              <span style={{ color: 'var(--color-text-muted)' }}>Coverage: <strong>{latest.testResults.coverage}%</strong></span>
              <span style={{ color: 'var(--color-text-muted)' }}>Total: <strong>{latest.testResults.total} tests</strong></span>
            </div>
          )}
        </Card>
      )}

      {/* Build History */}
      <Card>
        <SectionHeader title="Build History" />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Build', 'Branch', 'Commit', 'Triggered By', 'Duration', 'Tests', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.map((run, i) => (
              <tr key={run._id} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--color-bg)' }}>
                <td style={{ padding: '10px 10px', fontWeight: 600 }}>#{run.buildNumber}</td>
                <td style={{ padding: '10px 10px' }}><code style={{ fontSize: 11, background: 'var(--color-bg)', padding: '2px 6px', borderRadius: 4 }}>{run.branch}</code></td>
                <td style={{ padding: '10px 10px', color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 12 }}>{run.commit}</td>
                <td style={{ padding: '10px 10px', color: 'var(--color-text-muted)' }}>{run.triggeredBy}</td>
                <td style={{ padding: '10px 10px', color: 'var(--color-text-muted)' }}>{run.duration}</td>
                <td style={{ padding: '10px 10px' }}>
                  <span style={{ color: '#166534' }}>{run.testResults.passed}✓</span>
                  {run.testResults.failed > 0 && <span style={{ color: '#991b1b', marginLeft: 4 }}>{run.testResults.failed}✗</span>}
                </td>
                <td style={{ padding: '10px 10px' }}><StatusBadge status={run.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Jenkins Info */}
      <div className="cards-grid" style={{ marginTop: 20 }}>
        {[
          { title: 'Jenkins Setup', items: ['Declarative Pipeline (Jenkinsfile)', 'GitHub Webhook trigger on push', 'Blue Ocean visual pipeline view', 'JUnit XML test result parsing', 'Build artifact archiving'] },
          { title: 'Pipeline Stages', items: ['Checkout → Install Deps → Lint', 'Unit Tests (Jest) → E2E (Selenium)', 'Docker build & registry push', 'Ansible deploy to staging', 'Smoke tests → Prod deploy'] },
          { title: 'Quality Gates', items: ['All tests must pass (0 failures)', 'Code coverage ≥ 80%', 'No high-severity npm vulnerabilities', 'ESLint zero errors', 'Health check after staging deploy'] },
        ].map(sec => (
          <Card key={sec.title}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: 'var(--color-primary)' }}>{sec.title}</div>
            {sec.items.map(item => (
              <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: 'var(--color-accent)' }}>→</span>
                <span>{item}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
