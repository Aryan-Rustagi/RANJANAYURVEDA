import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AdminLogin from './pages/AdminLogin';
import DashboardOverview from './pages/DashboardOverview';
import PatientsList from './pages/PatientsList';
import AppointmentsManager from './pages/AppointmentsManager';
import { setAdminToken, getAdminToken } from './services/adminApi';
import './index.css';

const VALID_ADMIN_PAGES = ['dashboard', 'patients', 'appointments'];

export default function App() {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_user');
      const token = getAdminToken();
      return saved && token ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const getInitialPage = () => {
    try {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (VALID_ADMIN_PAGES.includes(hash)) return hash;
      const saved = localStorage.getItem('admin_active_page');
      if (saved && VALID_ADMIN_PAGES.includes(saved)) return saved;
      return 'dashboard';
    } catch {
      return 'dashboard';
    }
  };

  const [activePage, setActivePageState] = useState(getInitialPage);

  const setActivePage = (page) => {
    setActivePageState(page);
    try {
      localStorage.setItem('admin_active_page', page);
      if (window.location.hash !== `#${page}`) {
        window.location.hash = page;
      }
    } catch (e) {
      console.warn('Failed to save admin page state:', e);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (VALID_ADMIN_PAGES.includes(hash)) {
        setActivePageState(hash);
        localStorage.setItem('admin_active_page', hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (admin && !window.location.hash && activePage) {
      window.location.hash = activePage;
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [admin]);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('admin_user', JSON.stringify(adminData));
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_active_page');
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
