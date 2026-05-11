import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Login.css';

export default function Login({ onLogin }) {
  const [form, setForm]     = useState({ username: 'admin', password: 'admin123' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await authAPI.login(form);
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-icon">CO</div>
          <h1 className="brand-name">CampusOps</h1>
          <p className="brand-tagline">Smart Campus Infrastructure Automation Platform</p>
        </div>
        <div className="login-features">
          {['Real-time infrastructure monitoring', 'Energy & HVAC automation', 'Network & security management', 'CI/CD pipeline integration'].map(f => (
            <div key={f} className="feature-item">
              <span className="feature-check">✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Sign In</h2>
          <p className="login-sub">Access the campus management dashboard</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="admin"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="demo-credentials">
            <p className="demo-title">Demo Accounts</p>
            <div className="demo-row"><code>admin</code> / <code>admin123</code> — Full access</div>
            <div className="demo-row"><code>operator</code> / <code>op123</code> — Operator</div>
            <div className="demo-row"><code>viewer</code> / <code>view123</code> — Read only</div>
          </div>
        </div>
      </div>
    </div>
  );
}
