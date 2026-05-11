import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout    from './components/Layout';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Energy    from './pages/Energy';
import Network   from './pages/Network';
import Security  from './pages/Security';
import HVAC      from './pages/HVAC';
import Alerts    from './pages/Alerts';
import Pipeline  from './pages/Pipeline';
import Services  from './pages/Services';

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('campusops_user');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (userData, token) => {
    localStorage.setItem('campusops_token', token);
    localStorage.setItem('campusops_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('campusops_token');
    localStorage.removeItem('campusops_user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/*"
          element={
            user
              ? <Layout user={user} onLogout={handleLogout}>
                  <Routes>
                    <Route path="/"         element={<Dashboard />} />
                    <Route path="/energy"   element={<Energy />} />
                    <Route path="/network"  element={<Network />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/hvac"     element={<HVAC />} />
                    <Route path="/alerts"   element={<Alerts />} />
                    <Route path="/pipeline" element={<Pipeline />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="*"         element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
