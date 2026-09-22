import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calendar, LogOut, Shield } from 'lucide-react';
import { fetchDashboardStats } from '../services/adminApi';

export default function Sidebar({ activePage, setActivePage, onLogout }) {
  const [pendingCount, setPendingCount] = useState(0);

  const checkPending = async () => {
    try {
      const data = await fetchDashboardStats();
      if (data.stats && typeof data.stats.pending === 'number') {
        setPendingCount(data.stats.pending);
      }
    } catch {
      // Ignore network silent fails in background
    }
  };

  useEffect(() => {
    checkPending();
    const interval = setInterval(checkPending, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: pendingCount },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Shield size={20} />
          </div>
          <div className="sidebar-logo-text">
            <h2>Admin Panel</h2>
            <span>Ranjan's Ayurveda</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <item.icon size={18} className="nav-icon" />
              {item.label}
            </div>
            {item.badge > 0 && (
              <span
                style={{
                  background: '#f9ab00',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  lineHeight: '1.2'
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
