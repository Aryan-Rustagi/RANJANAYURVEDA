import React, { useState } from 'react';
import { User, Phone, Mail, Lock, MapPin, UserPlus, CheckCircle2 } from 'lucide-react';

export default function SignUp({ setActiveTab }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    branch: 'Kangra',
    password: '',
    confirmPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveTab('login');
    }, 2500);
  };

  return (
    <div className="auth-wrapper animate-fade-in" style={{ maxWidth: '500px' }}>
      <div className="glass-card auth-card">
        {/* Auth Header */}
        <div className="auth-header">
          <div className="logo-icon-wrap" style={{ margin: '0 auto 14px auto', width: '48px', height: '48px', borderRadius: '10px' }}>
            R
          </div>
          <h2 className="auth-title">NEW PATIENT <span>REGISTRATION</span></h2>
          <p className="auth-subtitle">
            Join Ranjan's Ayurveda Centre for holistic wellness
          </p>
        </div>

        {/* Feedback message */}
        {submitted && (
          <div style={{
            background: 'var(--color-gold-subtle)',
            border: '1px solid var(--color-gold-accent)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-maroon-primary)',
            fontSize: '0.88rem',
            textAlign: 'center',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            <span>Account created successfully! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              <User size={15} /> Full Name
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Rajesh Kumar"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          {/* Grid row for Phone & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">
                <Phone size={15} /> Phone Number
              </label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="90154 72705"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={15} /> Email Address
              </label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Preferred Branch */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={15} /> Preferred Centre Branch
            </label>
            <select 
              className="form-input"
              value={formData.branch}
              onChange={(e) => setFormData({...formData, branch: e.target.value})}
            >
              <option value="Kangra">Branch 1 - Kangra (Opp. Hotel Krishna Intl, Birta Road)</option>
              <option value="Dharamshala">Branch 2 - Dharamshala (Kotwali Bazaar, Khanyara Road)</option>
            </select>
          </div>

          {/* Grid row for Passwords */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">
                <Lock size={15} /> Password
              </label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={15} /> Confirm Password
              </label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Terms */}
          <div style={{ marginBottom: '20px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            By registering, you agree to receive appointment reminders and Ayurvedic wellness updates.
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-gold" style={{ width: '100%' }}>
            <UserPlus size={16} /> Register Patient Account
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="auth-footer-text">
          Already registered?
          <span className="auth-link" onClick={() => setActiveTab('login')}>
            Sign In Here
          </span>
        </div>
      </div>
    </div>
  );
}
