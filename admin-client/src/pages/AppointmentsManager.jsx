import React, { useState, useEffect } from 'react';
import {
  Calendar, Search, RefreshCw, Plus, X, Check, CheckCircle2, Trash2, Phone, AlertCircle, Clock
} from 'lucide-react';
import {
  fetchAllAppointments, updateAppointmentStatus, deleteAppointmentApi, createWalkInAppointment
} from '../services/adminApi';

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newAppt, setNewAppt] = useState({
    patientName: '', patientPhone: '', branch: 'Kangra Centre',
    treatment: 'General Consultation', appointmentDate: '', timeSlot: '10:00 AM',
    status: 'Confirmed', notes: ''
  });

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const loadAppointments = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const data = await fetchAllAppointments();
      if (data.appointments) setAppointments(data.appointments);
    } catch (err) {
      console.warn('Load appointments error:', err.message);
    } finally {
      setLoading(false);
      if (manual) setTimeout(() => setRefreshing(false), 400);
    }
  };

  useEffect(() => {
    loadAppointments();
    const interval = setInterval(() => loadAppointments(), 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id, status, patientName = '') => {
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    try {
      await updateAppointmentStatus(id, status);
      if (status === 'Confirmed') {
        showToast(`✅ Appointment for ${patientName || 'patient'} has been allowed & confirmed!`);
      } else if (status === 'Cancelled') {
        showToast(`❌ Appointment for ${patientName || 'patient'} marked as cancelled.`);
      } else if (status === 'Completed') {
        showToast(`🎉 Appointment marked as completed.`);
      }
    } catch (e) {
      console.error(e);
      alert('Status update failed: ' + e.message);
      loadAppointments();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this appointment?')) return;
    try {
      await deleteAppointmentApi(id);
      setAppointments(prev => prev.filter(a => a._id !== id));
      showToast('🗑️ Appointment deleted successfully.');
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newAppt.patientName || !newAppt.patientPhone) return;
    try {
      await createWalkInAppointment(newAppt);
      setShowAddModal(false);
      setNewAppt({
        patientName: '', patientPhone: '', branch: 'Kangra Centre',
        treatment: 'General Consultation', appointmentDate: '', timeSlot: '10:00 AM',
        status: 'Confirmed', notes: ''
      });
      showToast('✅ Walk-in appointment registered successfully.');
      loadAppointments(true);
    } catch (e) {
      alert('Failed: ' + e.message);
    }
  };

  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'Cancelled').length;

  const filtered = appointments.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (a.patientName || '').toLowerCase().includes(q) || (a.patientPhone || '').includes(q);
    const matchesBranch = branchFilter === 'All' || (a.branch || '').includes(branchFilter);
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const statusBadge = (status) => {
    if (status === 'Confirmed') {
      return <span className="badge badge-confirmed"><Check size={12} /> Confirmed</span>;
    }
    if (status === 'Pending') {
      return (
        <span className="badge badge-pending">
          <span className="pulse-yellow"></span> Pending Approval
        </span>
      );
    }
    if (status === 'Completed') {
      return <span className="badge badge-completed"><CheckCircle2 size={12} /> Completed</span>;
    }
    return <span className="badge badge-cancelled"><X size={12} /> Cancelled</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Appointments
            <span className="live-dot" style={{ marginLeft: '4px' }}></span>
          </h1>
          <p>{appointments.length} total appointments — real-time MongoDB Atlas stream</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => loadAppointments(true)}>
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Walk-in
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

      {/* Pending Approvals Alert Banner */}
      {pendingCount > 0 && (
        <div className="pending-banner">
          <div className="pending-banner-content">
            <div className="pending-banner-icon">
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#874900', fontSize: '0.95rem' }}>
                {pendingCount} Appointment Request{pendingCount > 1 ? 's' : ''} Awaiting Admin Confirmation
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                Patients have submitted booking requests online. Click "Allow & Confirm" to approve their appointment slots.
              </div>
            </div>
          </div>
          <button
            className={`filter-chip ${statusFilter === 'Pending' ? 'active-pending' : ''}`}
            style={{ borderColor: '#f9ab00', background: statusFilter === 'Pending' ? '#b06000' : '#ffffff' }}
            onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'All' : 'Pending')}
          >
            {statusFilter === 'Pending' ? 'Showing Pending Only' : 'Filter Pending Requests'}
            <span className="badge-count" style={{ background: '#fef0cd', color: '#874900' }}>{pendingCount}</span>
          </button>
        </div>
      )}

      {/* Filters & Status Chips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search patient or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="input" style={{ width: '180px' }} value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="All">All Branches</option>
            <option value="Kangra">Kangra Centre</option>
            <option value="Dharamshala">Dharamshala Centre</option>
          </select>
        </div>

        {/* Quick Filter Status Chips */}
        <div className="filter-chips">
          <button
            className={`filter-chip ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            All Appointments <span className="badge-count">{appointments.length}</span>
          </button>

          <button
            className={`filter-chip ${statusFilter === 'Pending' ? 'active-pending' : ''}`}
            onClick={() => setStatusFilter('Pending')}
            style={pendingCount > 0 && statusFilter !== 'Pending' ? { borderColor: '#f9ab00', color: '#b06000', background: '#fffcf2' } : {}}
          >
            {pendingCount > 0 && <span className="pulse-yellow"></span>}
            Pending Approval <span className="badge-count">{pendingCount}</span>
          </button>

          <button
            className={`filter-chip ${statusFilter === 'Confirmed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Confirmed')}
          >
            Confirmed <span className="badge-count">{confirmedCount}</span>
          </button>

          <button
            className={`filter-chip ${statusFilter === 'Completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Completed')}
          >
            Completed <span className="badge-count">{completedCount}</span>
          </button>

          <button
            className={`filter-chip ${statusFilter === 'Cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Cancelled')}
          >
            Cancelled <span className="badge-count">{cancelledCount}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Phone</th>
                <th>Treatment</th>
                <th>Branch</th>
                <th>Date & Slot</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', minWidth: '180px' }}>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Loading appointments stream...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                    {statusFilter === 'Pending' ? 'No pending appointments awaiting approval.' : 'No appointments matching current filters.'}
                  </td>
                </tr>
              ) : (
                filtered.map(appt => (
                  <tr key={appt._id} className={appt.status === 'Pending' ? 'row-pending' : ''}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--color-maroon-primary)' }}>{appt.patientName}</div>
                      {appt.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }} title={appt.notes}>
                          📝 {appt.notes.length > 30 ? appt.notes.slice(0, 30) + '...' : appt.notes}
                        </div>
                      )}
                    </td>
                    <td>
                      <a
                        href={`tel:${(appt.patientPhone || '').replace(/\s/g, '')}`}
                        style={{ color: 'var(--color-maroon-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                      >
                        <Phone size={12} /> {appt.patientPhone}
                      </a>
                    </td>
                    <td style={{ maxWidth: '180px', fontSize: '0.88rem' }}>{appt.treatment}</td>
                    <td><span className="badge badge-branch">{appt.branch}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <strong>{appt.appointmentDate}</strong> · {appt.timeSlot}
                    </td>
                    <td>{statusBadge(appt.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {appt.status === 'Pending' && (
                          <>
                            <button
                              className="btn btn-approve btn-sm"
                              onClick={() => handleStatusChange(appt._id, 'Confirmed', appt.patientName)}
                              title="Allow & Confirm this appointment"
                            >
                              <Check size={14} /> Allow & Confirm
                            </button>
                            <button
                              className="btn btn-red btn-sm"
                              onClick={() => handleStatusChange(appt._id, 'Cancelled', appt.patientName)}
                              title="Reject & Cancel request"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}

                        {appt.status === 'Confirmed' && (
                          <>
                            <button
                              className="btn btn-yellow btn-sm"
                              onClick={() => handleStatusChange(appt._id, 'Completed', appt.patientName)}
                              title="Mark as Completed"
                            >
                              <CheckCircle2 size={13} /> Complete
                            </button>
                            <button
                              className="btn btn-red btn-sm"
                              onClick={() => handleStatusChange(appt._id, 'Cancelled', appt.patientName)}
                              title="Cancel Appointment"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}

                        {appt.status === 'Completed' && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleStatusChange(appt._id, 'Confirmed', appt.patientName)}
                            title="Reopen / Set Confirmed"
                          >
                            Reopen
                          </button>
                        )}

                        {appt.status === 'Cancelled' && (
                          <button
                            className="btn btn-green btn-sm"
                            onClick={() => handleStatusChange(appt._id, 'Confirmed', appt.patientName)}
                            title="Re-confirm Appointment"
                          >
                            <Check size={12} /> Re-confirm
                          </button>
                        )}

                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#c5221f', borderColor: 'transparent', padding: '6px 8px' }}
                          onClick={() => handleDelete(appt._id)}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Walk-in Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: '700', color: 'var(--color-maroon-primary)' }}>Add Walk-in Patient</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Patient Full Name</label>
                <input type="text" className="input" placeholder="e.g. Ramesh Kumar" value={newAppt.patientName} onChange={(e) => setNewAppt({ ...newAppt, patientName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone Number</label>
                <input type="text" className="input" placeholder="e.g. 98160 12345" value={newAppt.patientPhone} onChange={(e) => setNewAppt({ ...newAppt, patientPhone: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Clinic Branch</label>
                  <select className="input" value={newAppt.branch} onChange={(e) => setNewAppt({ ...newAppt, branch: e.target.value })}>
                    <option value="Kangra Centre">Kangra Centre</option>
                    <option value="Dharamshala Centre">Dharamshala Centre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <select className="input" value={newAppt.timeSlot} onChange={(e) => setNewAppt({ ...newAppt, timeSlot: e.target.value })}>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Ayurvedic Treatment / Specialization</label>
                <select className="input" value={newAppt.treatment} onChange={(e) => setNewAppt({ ...newAppt, treatment: e.target.value })}>
                  <option value="General Consultation">General Consultation</option>
                  <option value="Arthritis Treatment">Arthritis (घुटनों का दर्द)</option>
                  <option value="Slip Disc Treatment">Slip Disc (कमर दर्द)</option>
                  <option value="Cervical Spondylosis">Cervical Spondylosis (गर्दन दर्द)</option>
                  <option value="Sciatica Relief">Sciatica (साइटिका)</option>
                  <option value="Panchakarma Therapy">Panchakarma Therapy</option>
                  <option value="Nadi Pariksha">Nadi Pariksha</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Appointment Date</label>
                  <input type="date" className="input" value={newAppt.appointmentDate} onChange={(e) => setNewAppt({ ...newAppt, appointmentDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select className="input" value={newAppt.status} onChange={(e) => setNewAppt({ ...newAppt, status: e.target.value })}>
                    <option value="Confirmed">Confirmed (Approved)</option>
                    <option value="Pending">Pending Approval</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Clinical Notes (Optional)</label>
                <input type="text" className="input" placeholder="e.g. Referred for knee pain" value={newAppt.notes} onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
