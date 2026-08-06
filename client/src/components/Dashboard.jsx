import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, CheckCircle2, User, Phone, Plus, X, 
  FileText, Sparkles, AlertCircle, Heart, Pill, Leaf, 
  Download, LogOut, Flame, Droplets, RefreshCw, ShieldCheck, Mail
} from 'lucide-react';
import { fetchMyAppointmentsApi, bookAppointmentApi, deleteAppointmentApi, fetchPrescriptionsApi, requestRefillApi } from '../services/api';

export default function Dashboard({ setActiveTab, user, onLogout }) {
  const [activeSubTab, setActiveSubTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [myAppointments, setMyAppointments] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [selectedRefillItem, setSelectedRefillItem] = useState(null);
  const [refillSuccess, setRefillSuccess] = useState(false);

  // New Appointment Form State
  const [bookingForm, setBookingForm] = useState({
    treatment: 'Slip Disc (कमर दर्द) Treatment',
    branch: user ? (user.preferredBranch || 'Kangra Centre') : 'Kangra Centre',
    appointmentDate: '',
    timeSlot: '09:00 AM',
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // Patient Profile Data from user session
  const profile = {
    name: user ? user.name : "Rajesh Kumar",
    phone: user ? user.phone : "98160 12345",
    email: user ? user.email : "rajesh.kumar@example.com",
    patientId: user ? (user.patientId || "RAY-2026-892") : "RAY-2026-892",
    dosha: user ? (user.dosha || "Vata-Pitta") : "Vata-Pitta",
    primaryCondition: user ? (user.primaryCondition || "Slip Disc & Lumbar Spondylosis") : "Slip Disc & Lumbar Spondylosis",
    preferredBranch: user ? (user.preferredBranch || "Kangra Centre") : "Kangra Centre",
    attendingDoctor: user && user.preferredBranch && user.preferredBranch.includes('Dharamshala') ? "Dr. Ananya Katoch" : "Dr. Ranjan Sharma"
  };

  // Load patient's live appointments from MongoDB Atlas API
  const loadMyAppointments = async () => {
    setLoading(true);
    try {
      const data = await fetchMyAppointmentsApi();
      if (data && data.appointments) {
        setMyAppointments(data.appointments);
      }
    } catch (err) {
      console.warn("My appointments API notice:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMyAppointments();
      const interval = setInterval(() => {
        loadMyAppointments();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle Protected Route check if user is null
  if (!user) {
    return (
      <div className="animate-fade-in" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '36px', background: '#ffffff' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-gold-subtle)', color: 'var(--color-maroon-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', marginBottom: '8px' }}>
            Protected Patient Dashboard
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Please sign in to your registered patient account to view your medical info, book appointments, and check your treatment plan.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn-gold" style={{ flex: 1 }} onClick={() => setActiveTab('login')}>
              Sign In to Account
            </button>
            <button className="btn-maroon-outline" style={{ flex: 1 }} onClick={() => setActiveTab('signup')}>
              Register New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Submit New Appointment
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.appointmentDate) {
      setBookingError("Please select a preferred date.");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const response = await bookAppointmentApi({
        patientName: profile.name,
        patientPhone: profile.phone,
        treatment: bookingForm.treatment,
        branch: bookingForm.branch,
        appointmentDate: bookingForm.appointmentDate,
        timeSlot: bookingForm.timeSlot,
        notes: bookingForm.notes
      });

      setBookingLoading(false);
      setBookingSuccess(`Appointment successfully booked for ${bookingForm.appointmentDate} at ${bookingForm.branch}!`);
      loadMyAppointments();

      setTimeout(() => {
        setBookingSuccess(null);
        setShowBookModal(false);
        setActiveSubTab('appointments');
      }, 1400);
    } catch (err) {
      setBookingLoading(false);
      setBookingError(err.message || "Failed to book appointment.");
    }
  };

  // Cancel / Delete Appointment
  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel and delete this appointment?")) return;

    try {
      await deleteAppointmentApi(id);
      loadMyAppointments();
    } catch (err) {
      alert(err.message || "Failed to cancel appointment.");
    }
  };

  const handleRefillRequest = (item) => {
    setSelectedRefillItem(item);
    setShowRefillModal(true);
  };

  const confirmRefill = async () => {
    try {
      if (selectedRefillItem) {
        await requestRefillApi(selectedRefillItem.name);
      }
    } catch (e) {}
    setRefillSuccess(true);
    setTimeout(() => {
      setRefillSuccess(false);
      setShowRefillModal(false);
    }, 1400);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Patient Welcome Header */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '28px', background: 'linear-gradient(135deg, #ffffff 0%, #faf5ec 100%)', border: '1px solid rgba(196, 154, 69, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--color-maroon-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: '700',
              fontFamily: 'var(--font-serif)',
              boxShadow: '0 6px 16px rgba(122, 27, 40, 0.2)'
            }}>
              {profile.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.7rem', fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', margin: 0, fontWeight: '700' }}>
                  Namaste, {profile.name}
                </h1>
                <span className="badge-gold" style={{ fontSize: '0.75rem' }}>
                  Patient ID: {profile.patientId}
                </span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                Active Care: <strong>{profile.primaryCondition}</strong> • {profile.preferredBranch}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-gold" onClick={() => setShowBookModal(true)} style={{ fontSize: '0.88rem', padding: '10px 18px' }}>
              <Plus size={16} /> Book New Appointment
            </button>
            <button className="btn-maroon-outline" onClick={onLogout} style={{ fontSize: '0.88rem', padding: '10px 16px', color: '#c5221f', borderColor: '#c5221f' }}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main 4 Dashboard Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #eae3d9', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button 
          onClick={() => setActiveSubTab('info')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            fontSize: '0.98rem',
            fontWeight: '600',
            fontFamily: 'var(--font-sans)',
            color: activeSubTab === 'info' ? 'var(--color-maroon-primary)' : 'var(--color-text-muted)',
            borderBottom: activeSubTab === 'info' ? '3px solid var(--color-maroon-primary)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <User size={18} /> 1. Patient Profile & Info
        </button>

        <button 
          onClick={() => setActiveSubTab('book')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            fontSize: '0.98rem',
            fontWeight: '600',
            fontFamily: 'var(--font-sans)',
            color: activeSubTab === 'book' ? 'var(--color-maroon-primary)' : 'var(--color-text-muted)',
            borderBottom: activeSubTab === 'book' ? '3px solid var(--color-maroon-primary)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Plus size={18} /> 2. Book New Appointment
        </button>

        <button 
          onClick={() => setActiveSubTab('appointments')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            fontSize: '0.98rem',
            fontWeight: '600',
            fontFamily: 'var(--font-sans)',
            color: activeSubTab === 'appointments' ? 'var(--color-maroon-primary)' : 'var(--color-text-muted)',
            borderBottom: activeSubTab === 'appointments' ? '3px solid var(--color-maroon-primary)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Calendar size={18} /> 3. My Appointments ({myAppointments.length})
        </button>
      </div>

      {/* TAB 1: PATIENT INFO & PROFILE */}
      {activeSubTab === 'info' && (
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', margin: 0 }}>
              PATIENT PROFILE & HEALTH DOSSIER
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              Your confidential medical registration details at Ranjan's Ayurveda Centre
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', background: '#faf7f2', borderRadius: '12px', border: '1px solid #eae3d9' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Patient Name</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--color-maroon-primary)', marginTop: '4px' }}>{profile.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>ID: {profile.patientId}</div>
            </div>

            <div style={{ padding: '20px', background: '#faf7f2', borderRadius: '12px', border: '1px solid #eae3d9' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Phone & Email</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-text-main)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="var(--color-maroon-primary)" /> {profile.phone}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="var(--color-maroon-primary)" /> {profile.email}
              </div>
            </div>

            <div style={{ padding: '20px', background: '#faf7f2', borderRadius: '12px', border: '1px solid #eae3d9' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ayurvedic Dosha Type</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--color-maroon-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={18} color="var(--color-gold-accent)" /> {profile.dosha} Type
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Diagnosed via Nadi Pariksha</div>
            </div>

            <div style={{ padding: '20px', background: '#faf7f2', borderRadius: '12px', border: '1px solid #eae3d9' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preferred Branch & Doctor</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-text-main)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--color-maroon-primary)" /> {profile.preferredBranch}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Attending Doctor: {profile.attendingDoctor}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOK NEW APPOINTMENT */}
      {activeSubTab === 'book' && (
        <div className="glass-card" style={{ padding: '28px', background: '#ffffff' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', margin: 0 }}>
              BOOK AN APPOINTMENT / CONSULTATION
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              Directly schedules your slot into our MongoDB database
            </p>
          </div>

          {bookingSuccess && (
            <div style={{ padding: '16px', borderRadius: '8px', background: '#e6f4ea', color: '#137333', border: '1px solid #ceead6', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} />
              <span>{bookingSuccess}</span>
            </div>
          )}

          {bookingError && (
            <div style={{ padding: '16px', borderRadius: '8px', background: '#fce8e6', color: '#c5221f', border: '1px solid #fad2cf', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} />
              <span>{bookingError}</span>
            </div>
          )}

          <form onSubmit={handleBookingSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Treatment Needed</label>
                <select 
                  className="form-input"
                  value={bookingForm.treatment}
                  onChange={(e) => setBookingForm({ ...bookingForm, treatment: e.target.value })}
                >
                  <option value="Slip Disc (कमर दर्द) Treatment">Slip Disc (कमर दर्द) Treatment</option>
                  <option value="Arthritis (घुटनों का दर्द) Treatment">Arthritis (घुटनों का दर्द) Treatment</option>
                  <option value="Cervical Spondylosis (गर्दन दर्द)">Cervical Spondylosis (गर्दन दर्द)</option>
                  <option value="Sciatica (साइटिका) Relief">Sciatica (साइटिका) Relief</option>
                  <option value="Kati Basti & Panchakarma Therapy">Kati Basti & Panchakarma Therapy</option>
                  <option value="General Nadi Pariksha Consultation">General Nadi Pariksha Consultation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Centre Branch</label>
                <select 
                  className="form-input"
                  value={bookingForm.branch}
                  onChange={(e) => setBookingForm({ ...bookingForm, branch: e.target.value })}
                >
                  <option value="Kangra Centre">Branch 1 - Kangra Centre</option>
                  <option value="Dharamshala Centre">Branch 2 - Dharamshala Centre</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input 
                  type="date"
                  className="form-input"
                  value={bookingForm.appointmentDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, appointmentDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <select 
                  className="form-input"
                  value={bookingForm.timeSlot}
                  onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                >
                  <option value="09:00 AM">09:00 AM - Morning Slot</option>
                  <option value="09:30 AM">09:30 AM - Morning Slot</option>
                  <option value="10:00 AM">10:00 AM - Morning Slot</option>
                  <option value="10:30 AM">10:30 AM - Morning Slot</option>
                  <option value="11:00 AM">11:00 AM - Morning Slot</option>
                  <option value="11:30 AM">11:30 AM - Morning Slot</option>
                  <option value="12:00 PM">12:00 PM - Midday Slot</option>
                  <option value="01:30 PM">01:30 PM - Afternoon Slot</option>
                  <option value="02:00 PM">02:00 PM - Afternoon Slot</option>
                  <option value="02:30 PM">02:30 PM - Afternoon Slot</option>
                  <option value="03:00 PM">03:00 PM - Afternoon Slot</option>
                  <option value="03:30 PM">03:30 PM - Afternoon Slot</option>
                  <option value="04:00 PM">04:00 PM - Evening Slot</option>
                  <option value="04:30 PM">04:30 PM - Evening Slot</option>
                  <option value="05:00 PM">05:00 PM - Evening Slot</option>
                  <option value="05:30 PM">05:30 PM - Evening Slot</option>
                  <option value="06:00 PM">06:00 PM - Evening Slot</option>
                  <option value="06:30 PM">06:30 PM - Late Evening Slot</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">Health Symptoms / Notes</label>
              <input 
                type="text"
                className="form-input"
                placeholder="Briefly describe your joint or spine symptoms..."
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '16px', padding: '14px' }} disabled={bookingLoading}>
              {bookingLoading ? "Saving Appointment to MongoDB..." : "Confirm & Save Appointment"}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: USER APPOINTMENTS */}
      {activeSubTab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                YOUR APPOINTMENTS & CONSULTATION HISTORY
                <span className="badge-gold" style={{ fontSize: '0.72rem', background: '#e6f4ea', color: '#137333', borderColor: '#ceead6', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  🟢 Live MongoDB Stream
                </span>
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                Auto-syncing in real-time with clinic database
              </p>
            </div>
            <button className="btn-maroon-outline" style={{ fontSize: '0.85rem', padding: '8px 14px' }} onClick={loadMyAppointments}>
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} /> Refresh Appointments
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {loading ? (
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Loading your appointments...
              </div>
            ) : myAppointments.length === 0 ? (
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No appointments found yet. Click <strong>Book New Appointment</strong> tab to schedule your first consultation!
              </div>
            ) : (
              myAppointments.map((appt, idx) => (
                <div key={appt._id || appt.id || idx} className="glass-card" style={{ padding: '22px', borderLeft: '4px solid var(--color-maroon-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span className="badge-gold" style={{ fontSize: '0.72rem' }}>{appt.type || 'OPD Consultation'}</span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      background: appt.status === 'Confirmed' ? '#e6f4ea' : appt.status === 'Completed' ? '#e8f0fe' : '#fef7e0',
                      color: appt.status === 'Confirmed' ? '#137333' : appt.status === 'Completed' ? '#1a73e8' : '#b06000'
                    }}>
                      {appt.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-maroon-primary)', margin: '0 0 8px 0', fontFamily: 'var(--font-serif)' }}>
                    {appt.treatment}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', color: 'var(--color-text-main)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={15} color="var(--color-maroon-primary)" />
                      <strong>{appt.appointmentDate} ({appt.timeSlot || '10:30 AM'})</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={15} color="var(--color-maroon-primary)" />
                      <span>Doctor: <strong>{appt.doctorName || 'Dr. Ranjan Sharma'}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color="var(--color-maroon-primary)" />
                      <span>{appt.branch}</span>
                    </div>
                  </div>

                  {appt.instructions && (
                    <div style={{ padding: '10px 12px', background: 'var(--color-bg-subtle)', borderRadius: '8px', border: '1px solid #eae3d9', fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', gap: '8px', marginBottom: '14px' }}>
                      <AlertCircle size={16} color="var(--color-gold-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Instructions:</strong> {appt.instructions}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #f2ede4' }}>
                    <button 
                      onClick={() => handleCancelAppointment(appt._id || appt.id)}
                      style={{
                        background: '#fce8e6',
                        color: '#c5221f',
                        border: '1px solid #fad2cf',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <X size={14} /> Cancel / Delete Appointment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Refill Modal */}
      {showRefillModal && selectedRefillItem && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: '440px', width: '100%', padding: '28px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--color-maroon-primary)' }}>Request Medicine Refill</h3>
              <button onClick={() => setShowRefillModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {refillSuccess ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#137333' }}>
                <CheckCircle2 size={44} style={{ marginBottom: '8px' }} />
                <h4>Refill Request Submitted!</h4>
              </div>
            ) : (
              <div>
                <p>Requesting refill for <strong>{selectedRefillItem.name}</strong></p>
                <button className="btn-gold" style={{ width: '100%', marginTop: '16px' }} onClick={confirmRefill}>Confirm Refill Request</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
