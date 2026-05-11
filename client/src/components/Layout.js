import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Layout.css';

const navItems = [
  { path: '/',         label: 'Dashboard',  icon: '⊞' },
  { path: '/energy',   label: 'Energy',     icon: '⚡' },
  { path: '/hvac',     label: 'HVAC',       icon: '🌡' },
  { path: '/network',  label: 'Network',    icon: '🔗' },
  { path: '/security', label: 'Security',   icon: '🔒' },
  { path: '/alerts',   label: 'Alerts',     icon: '🔔' },
  { path: '/services', label: 'Services',   icon: '⚙' },
  { path: '/pipeline', label: 'CI/CD',      icon: '🚀' },
];

export default function Layout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">CO</span>
            {sidebarOpen && <div className="logo-text-wrap">
              <span className="logo-name">CampusOps</span>
              <span className="logo-tagline">Infrastructure Platform</span>
            </div>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && <div className="user-info">
            <div className="user-avatar">{user.username[0].toUpperCase()}</div>
            <div>
              <div className="user-name">{user.username}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>}
          <button className="logout-btn" onClick={onLogout} title="Logout">
            {sidebarOpen ? 'Logout' : '↩'}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-wrap">
        {/* Header */}
        <header className="topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(s => !s)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <div className="topbar-title">Smart Campus Infrastructure</div>
          <div className="topbar-right">
            <span className="live-badge"><span className="live-dot"></span>Live</span>
            <span className="topbar-time">{time.toLocaleTimeString()}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
