import React, { useState } from 'react';
import { 
  Users, Calendar, Clock, MapPin, CheckCircle2, XCircle, Search, Plus, 
  Filter, Shield, Activity, Phone, ChevronRight, LogOut, Check, X, AlertCircle
} from 'lucide-react';

export default function Admin({ setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Initial mock appointment data
  const [appointments, setAppointments] = useState([
    { id: 1, name: "Rajesh Kumar", phone: "98160 12345", branch: "Kangra", treatment: "Slip Disc (कमर दर्द)", date: "Today, 10:30 AM", status: "Confirmed" },
    { id: 2, name: "Sunita Devi", phone: "94181 54321", branch: "Dharamshala", treatment: "Arthritis (घुटनों का दर्द)", date: "Today, 11:45 AM", status: "Pending" },
    { id: 3, name: "Amit Sharma", phone: "70182 99887", branch: "Kangra", treatment: "Panchakarma Detox", date: "Today, 02:00 PM", status: "Confirmed" },
    { id: 4, name: "Meenakshi Verma", phone: "98055 33221", branch: "Dharamshala", treatment: "Cervical Spondylosis", date: "Today, 03:30 PM", status: "Completed" },
    { id: 5, name: "Vijay Singh", phone: "98177 66554", branch: "Kangra", treatment: "Sciatica (साइटिका)", date: "Tomorrow, 10:00 AM", status: "Confirmed" }
  ]);

  const [newAppt, setNewAppt] = useState({
    name: '',
    phone: '',
    branch: 'Kangra',
    treatment: 'Arthritis (घुटनों का दर्द)',
    date: 'Today, 12:00 PM'
  });

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(appt => 
      appt.id === id ? { ...appt, status: newStatus } : appt
    ));
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!newAppt.name || !newAppt.phone) return;
    const added = {
      id: Date.now(),
      ...newAppt,
      status: 'Confirmed'
    };
    setAppointments([added, ...appointments]);
    setShowAddModal(false);
    setNewAppt({ name: '', phone: '', branch: 'Kangra', treatment: 'Arthritis (घुटनों का दर्द)', date: 'Today, 12:00 PM' });
  };

  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = appt.name.toLowerCase().includes(searchQuery.toLowerCase()) || appt.phone.includes(searchQuery);
    const matchesBranch = selectedBranchFilter === 'All' || appt.branch === selectedBranchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="animate-fade-in">
      {/* Admin Top Header Banner */}
      <div className="glass-card" style={{ padding: '24px 28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="logo-icon-wrap" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', margin: 0 }}>
              ADMIN CONTROL PANEL
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Ranjan's Ayurveda Centre • Clinical Management Dashboard
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-gold" style={{ fontSize: '0.88rem', padding: '8px 16px' }} onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Walk-in Patient
          </button>
          <button className="btn-maroon-outline" style={{ fontSize: '0.88rem', padding: '8px 14px' }} onClick={() => setActiveTab('home')}>
            <LogOut size={15} /> Exit Admin
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-gold-subtle)', color: 'var(--color-maroon-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-maroon-primary)' }}>{appointments.length}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Total Appointments</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-gold-subtle)', color: 'var(--color-maroon-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-maroon-primary)' }}>142</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Registered Patients</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-gold-subtle)', color: 'var(--color-maroon-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-maroon-primary)' }}>2 Branches</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Kangra & Dharamshala</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-gold-subtle)', color: 'var(--color-maroon-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-maroon-primary)' }}>Active</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Vaidya Doctors On Shift</div>
          </div>
        </div>
      </div>

      {/* Appointment Management Table & Controls */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', margin: 0 }}>
            PATIENT APPOINTMENTS MANAGEMENT
          </h2>

          {/* Filters & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text"
                placeholder="Search patient name/phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #eae3d9',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Branch Filter Dropdown */}
            <select 
              value={selectedBranchFilter} 
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #eae3d9',
                fontSize: '0.85rem',
                outline: 'none',
                background: '#fff'
              }}
            >
              <option value="All">All Branches</option>
              <option value="Kangra">Branch 1 - Kangra</option>
              <option value="Dharamshala">Branch 2 - Dharamshala</option>
            </select>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle)', borderBottom: '1px solid #eae3d9' }}>
                <th style={{ padding: '12px 14px', color: 'var(--color-maroon-primary)', fontWeight: '600' }}>Patient Name</th>
                <th style={{ padding: '12px 14px', color: 'var(--color-maroon-primary)', fontWeight: '600' }}>Phone</th>
                <th style={{ padding: '12px 14px', color: 'var(--color-maroon-primary)', fontWeight: '600' }}>Branch</th>
                <th style={{ padding: '12px 14px', color: 'var(--color-maroon-primary)', fontWeight: '600' }}>Treatment / Specialization</th>
                <th style={{ padding: '12px 14px', color: 'var(--color-maroon-primary)', fontWeight: '600' }}>Date & Time</th>
                <th style={{ padding: '12px 14px', color: 'var(--color-maroon-primary)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 14px', color: 'var(--color-maroon-primary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No appointments found matching your search query.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f2ede4' }}>
                    <td style={{ padding: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>{item.name}</td>
                    <td style={{ padding: '14px' }}>
                      <a href={`tel:${item.phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-maroon-primary)', textDecoration: 'underline', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} /> {item.phone}
                      </a>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="badge-gold" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                        {item.branch}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--color-text-main)' }}>{item.treatment}</td>
                    <td style={{ padding: '14px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{item.date}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        backgroundColor: item.status === 'Confirmed' ? '#e6f4ea' : item.status === 'Completed' ? '#e8f0fe' : '#fef7e0',
                        color: item.status === 'Confirmed' ? '#137333' : item.status === 'Completed' ? '#1a73e8' : '#b06000'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {item.status !== 'Confirmed' && (
                          <button 
                            onClick={() => handleStatusChange(item.id, 'Confirmed')}
                            title="Confirm Appointment"
                            style={{ background: '#e6f4ea', border: 'none', color: '#137333', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {item.status !== 'Completed' && (
                          <button 
                            onClick={() => handleStatusChange(item.id, 'Completed')}
                            title="Mark as Completed"
                            style={{ background: '#e8f0fe', border: 'none', color: '#1a73e8', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => setAppointments(appointments.filter(a => a.id !== item.id))}
                          title="Cancel Appointment"
                          style={{ background: '#fce8e6', border: 'none', color: '#c5221f', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <X size={14} />
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

      {/* Add Walk-in Appointment Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ maxWidth: '460px', width: '100%', padding: '28px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)' }}>
                Add New Walk-in Appointment
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAppointment}>
              <div className="form-group">
                <label className="form-label">Patient Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter patient full name"
                  value={newAppt.name}
                  onChange={(e) => setNewAppt({ ...newAppt, name: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter contact number"
                  value={newAppt.phone}
                  onChange={(e) => setNewAppt({ ...newAppt, phone: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Branch Location</label>
                <select 
                  className="form-input"
                  value={newAppt.branch}
                  onChange={(e) => setNewAppt({ ...newAppt, branch: e.target.value })}
                >
                  <option value="Kangra">Branch 1 - Kangra</option>
                  <option value="Dharamshala">Branch 2 - Dharamshala</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Treatment Needed</label>
                <select 
                  className="form-input"
                  value={newAppt.treatment}
                  onChange={(e) => setNewAppt({ ...newAppt, treatment: e.target.value })}
                >
                  <option value="Arthritis (घुटनों का दर्द)">Arthritis (घुटनों का दर्द)</option>
                  <option value="Slip Disc (कमर दर्द)">Slip Disc (कमर दर्द)</option>
                  <option value="Cervical Spondylosis (गर्दन दर्द)">Cervical Spondylosis (गर्दन दर्द)</option>
                  <option value="Sciatica (साइटिका)">Sciatica (साइटिका)</option>
                  <option value="Panchakarma Therapy">Panchakarma Therapy</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-maroon-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold" style={{ flex: 1 }}>
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
