import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AdminLogin from './pages/AdminLogin';
import DashboardOverview from './pages/DashboardOverview';
import PatientsList from './pages/PatientsList';
import AppointmentsManager from './pages/AppointmentsManager';
import { setAdminToken, getAdminToken } from './services/adminApi';
import './index.css';

export default function App() {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_user');
      const token = getAdminToken();
      return saved && token ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('admin_user', JSON.stringify(adminData));
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  if (!admin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <>
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <main className="main-content">
        {activePage === 'dashboard' && <DashboardOverview />}
        {activePage === 'patients' && <PatientsList />}
        {activePage === 'appointments' && <AppointmentsManager />}
      </main>
    </>
  );
}
