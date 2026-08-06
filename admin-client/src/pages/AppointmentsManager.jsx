import React, { useState, useEffect } from 'react';
import {
  Calendar, Search, RefreshCw, Plus, X, Check, CheckCircle2, Trash2, Phone
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
  const [newAppt, setNewAppt] = useState({
    patientName: '', patientPhone: '', branch: 'Kangra Centre',
    treatment: 'General Consultation', appointmentDate: '', timeSlot: '10:00 AM', notes: ''
  });

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

  const handleStatusChange = async (id, status) => {
    setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
    try { await updateAppointmentStatus(id, status); } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await deleteAppointmentApi(id);
      setAppointments(appointments.filter(a => a._id !== id));
    } catch (e) { alert('Delete failed: ' + e.message); }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newAppt.patientName || !newAppt.patientPhone) return;
    try {
      await createWalkInAppointment(newAppt);
      setShowAddModal(false);
      setNewAppt({ patientName: '', patientPhone: '', branch: 'Kangra Centre', treatment: 'General Consultation', appointmentDate: '', timeSlot: '10:00 AM', notes: '' });
      loadAppointments(true);
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const filtered = appointments.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (a.patientName || '').toLowerCase().includes(q) || (a.patientPhone || '').includes(q);
    const matchesBranch = branchFilter === 'All' || (a.branch || '').includes(branchFilter);
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const statusBadge = (status) => {
    const cls = status === 'Confirmed' ? 'badge-confirmed' : status === 'Completed' ? 'badge-completed' : status === 'Pending' ? 'badge-pending' : 'badge-cancelled';
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Appointments
            <span className="live-dot" style={{ marginLeft: '4px' }}></span>
          </h1>
          <p>{appointments.length} total appointments — auto-refreshing every 4s</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => loadAppointments(true)}>
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Walk-in
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input type="text" className="input" placeholder="Search name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <select className="input" style={{ width: '180px' }} value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="All">All Branches</option>
          <option value="Kangra">Kangra</option>
          <option value="Dharamshala">Dharamshala</option>
        </select>
        <select className="input" style={{ width: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
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
                <th>Date & Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No appointments found.</td></tr>
              ) : (
                filtered.map(appt => (
                  <tr key={appt._id}>
                    <td style={{ fontWeight: '600' }}>{appt.patientName}</td>
                    <td>
                      <a href={`tel:${(appt.patientPhone || '').replace(/\s/g, '')}`} style={{ color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} /> {appt.patientPhone}
                      </a>
                    </td>
                    <td style={{ maxWidth: '200px', fontSize: '0.88rem' }}>{appt.treatment}</td>
                    <td><span className="badge badge-branch">{appt.branch}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {appt.appointmentDate} · {appt.timeSlot}
                    </td>
                    <td>{statusBadge(appt.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {appt.status !== 'Confirmed' && (
                          <button className="btn btn-green btn-sm" onClick={() => handleStatusChange(appt._id, 'Confirmed')} title="Confirm">
                            <Check size={12} />
                          </button>
                        )}
                        {appt.status !== 'Completed' && (
                          <button className="btn btn-yellow btn-sm" onClick={() => handleStatusChange(appt._id, 'Completed')} title="Complete">
                            <CheckCircle2 size={12} />
                          </button>
                        )}
                        <button className="btn btn-red btn-sm" onClick={() => handleDelete(appt._id)} title="Delete">
                          <Trash2 size={12} />
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
              <h3 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Add Walk-in Patient</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Patient Name</label>
                <input type="text" className="input" placeholder="Full name" value={newAppt.patientName} onChange={(e) => setNewAppt({ ...newAppt, patientName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="text" className="input" placeholder="Contact number" value={newAppt.patientPhone} onChange={(e) => setNewAppt({ ...newAppt, patientPhone: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Branch</label>
                  <select className="input" value={newAppt.branch} onChange={(e) => setNewAppt({ ...newAppt, branch: e.target.value })}>
                    <option value="Kangra Centre">Kangra</option>
                    <option value="Dharamshala Centre">Dharamshala</option>
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
                <label className="form-label">Treatment</label>
                <select className="input" value={newAppt.treatment} onChange={(e) => setNewAppt({ ...newAppt, treatment: e.target.value })}>
                  <option value="General Consultation">General Consultation</option>
                  <option value="Arthritis Treatment">Arthritis Treatment</option>
                  <option value="Slip Disc Treatment">Slip Disc Treatment</option>
                  <option value="Cervical Spondylosis">Cervical Spondylosis</option>
                  <option value="Sciatica Relief">Sciatica Relief</option>
                  <option value="Panchakarma Therapy">Panchakarma Therapy</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="input" value={newAppt.appointmentDate} onChange={(e) => setNewAppt({ ...newAppt, appointmentDate: e.target.value })} required />
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
