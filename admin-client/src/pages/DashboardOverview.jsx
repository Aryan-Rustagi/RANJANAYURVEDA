import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle2, Clock, XCircle, MapPin, RefreshCw, TrendingUp, Phone, Mail, Heart, Check, X } from 'lucide-react';
import { fetchDashboardStats, fetchAllAppointments, fetchAllPatients, updateAppointmentStatus } from '../services/adminApi';

export default function DashboardOverview({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [recentAppts, setRecentAppts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = async () => {
    try {
      const [statsData, apptsData, patientsData] = await Promise.all([
        fetchDashboardStats(),
        fetchAllAppointments(),
        fetchAllPatients()
      ]);
      if (statsData.stats) setStats(statsData.stats);
      if (apptsData.appointments) setRecentAppts(apptsData.appointments.slice(0, 8));
      if (patientsData.patients) setPatients(patientsData.patients.slice(0, 6));
    } catch (err) {
      console.warn('Dashboard load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickStatusChange = async (id, status, patientName = '') => {
    setRecentAppts(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    try {
      await updateAppointmentStatus(id, status);
      if (status === 'Confirmed') {
        showToast(`✅ Appointment for ${patientName || 'patient'} confirmed!`);
      }
      loadData();
    } catch (err) {
      alert('Action failed: ' + err.message);
      loadData();
    }
  };

  const statusBadge = (status) => {
    if (status === 'Confirmed') {
      return <span className="badge badge-confirmed"><Check size={11} /> Confirmed</span>;
    }
    if (status === 'Pending') {
      return (
        <span className="badge badge-pending">
          <span className="pulse-yellow"></span> Pending Approval
        </span>
      );
    }
    if (status === 'Completed') {
      return <span className="badge badge-completed"><CheckCircle2 size={11} /> Completed</span>;
    }
    return <span className="badge badge-cancelled"><X size={11} /> Cancelled</span>;
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading live admin dashboard stream...
      </div>
    );
  }

  const s = stats || { totalPatients: 0, totalAppointments: 0, todaysAppointments: 0, confirmed: 0, pending: 0, completed: 0, cancelled: 0, branches: { kangra: 0, dharamshala: 0 } };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Clinical Operations Dashboard
            <span className="badge-gold" style={{ fontSize: '0.72rem', background: '#e6f4ea', color: '#137333', borderColor: '#ceead6', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="live-dot"></span> Live Stream
            </span>
          </h1>
          <p>Real-time patient queue, appointments, and hospital analytics</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-ghost btn-sm" onClick={loadData}>
            <RefreshCw size={14} /> Refresh Live Data
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1100,
          background: '#2b2521', color: '#ffffff', padding: '12px 20px',
          borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          {notification}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon"><Users size={22} /></div>
          <div>
            <div className="stat-value">{s.totalPatients}</div>
            <div className="stat-label">Registered Patients</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon"><Calendar size={22} /></div>
          <div>
            <div className="stat-value">{s.totalAppointments}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#e6f4ea', color: '#137333' }}><CheckCircle2 size={22} /></div>
          <div>
            <div className="stat-value">{s.confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </div>
        </div>

        <div className="card stat-card" style={s.pending > 0 ? { borderColor: '#f9ab00', background: '#fffdf5' } : {}}>
          <div className="stat-icon" style={{ background: '#fef7e0', color: '#b06000' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {s.pending}
              {s.pending > 0 && <span className="pulse-yellow"></span>}
            </div>
            <div className="stat-label">Pending Approval</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon"><TrendingUp size={22} /></div>
          <div>
            <div className="stat-value">{s.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#fce8e6', color: '#c5221f' }}><XCircle size={22} /></div>
          <div>
            <div className="stat-value">{s.cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Registered Patients Table */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--color-gold-accent)" /> Registered Patients Directory ({patients.length})
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              Live patient profiles registered via web portal
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Dosha Type</th>
                <th>Preferred Branch</th>
                <th>Primary Condition</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px' }}>
                    No registered patients in database yet.
                  </td>
                </tr>
              ) : (
                patients.map((p, idx) => (
                  <tr key={p._id || idx}>
                    <td>
                      <span className="badge badge-branch" style={{ fontSize: '0.72rem' }}>
                        {p.patientId || 'RAY-2026-892'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--color-maroon-primary)' }}>{p.name}</td>
                    <td>
                      <a href={`tel:${(p.phone || '').replace(/\s+/g, '')}`} style={{ color: 'var(--color-maroon-primary)', fontWeight: '600', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} /> {p.phone || '9015472705'}
                      </a>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{p.email}</td>
                    <td>
                      <span style={{ color: 'var(--color-maroon-primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Heart size={13} color="var(--color-gold-accent)" /> {p.dosha || 'Vata-Pitta'}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                        <MapPin size={13} color="var(--color-maroon-primary)" /> {p.preferredBranch || 'Kangra Centre'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {p.primaryCondition || 'General Ayurvedic Consultation'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Appointments Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--color-gold-accent)" /> Live Appointments Queue
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              Latest customer appointments submitted online
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>Treatment</th>
                <th>Branch</th>
                <th>Date & Slot</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentAppts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px' }}>
                    No appointments in queue yet.
                  </td>
                </tr>
              ) : (
                recentAppts.map((appt, idx) => (
                  <tr key={appt._id || idx} className={appt.status === 'Pending' ? 'row-pending' : ''}>
                    <td style={{ fontWeight: '700', color: 'var(--color-maroon-primary)' }}>{appt.patientName}</td>
                    <td>
                      <a href={`tel:${(appt.patientPhone || '').replace(/\s+/g, '')}`} style={{ color: 'var(--color-maroon-primary)', fontWeight: '600', textDecoration: 'underline' }}>
                        {appt.patientPhone}
                      </a>
                    </td>
                    <td>{appt.treatment}</td>
                    <td><span className="badge badge-branch">{appt.branch}</span></td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      <strong>{appt.appointmentDate}</strong> · {appt.timeSlot}
                    </td>
                    <td>{statusBadge(appt.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      {appt.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-approve btn-sm"
                            onClick={() => handleQuickStatusChange(appt._id, 'Confirmed', appt.patientName)}
                            title="Allow & Confirm Appointment"
                          >
                            <Check size={13} /> Allow & Confirm
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
