import React, { useState } from 'react';
import { Mail, Lock, LogIn, CheckCircle2, Shield } from 'lucide-react';

export default function Login({ setActiveTab }) {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // If logging in with admin credentials or entering admin, switch to admin view
    const isAdmin = formData.emailOrPhone.toLowerCase().includes('admin');

    setTimeout(() => {
      setSubmitted(false);
      if (isAdmin) {
        setActiveTab('admin');
      }
    }, 1500);
  };

  return (
    <div className="auth-wrapper animate-fade-in">
      <div className="glass-card auth-card">
        {/* Auth Header */}
        <div className="auth-header">
          <div className="logo-icon-wrap" style={{ margin: '0 auto 14px auto', width: '48px', height: '48px', borderRadius: '10px' }}>
            R
          </div>
          <h2 className="auth-title">PORTAL <span>LOGIN</span></h2>
          <p className="auth-subtitle">
            Patient Portal & Clinical Administration
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
            <span>Login successful! Opening dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email or Phone */}
          <div className="form-group">
            <label className="form-label">
              <Mail size={15} /> Email / Username / Phone
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 9015472705 or admin"
              value={formData.emailOrPhone}
              onChange={(e) => setFormData({...formData, emailOrPhone: e.target.value})}
              required
            />
          </div>

          {/* Password */}
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

          {/* Options row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '0.84rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={formData.rememberMe}
                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                style={{ accentColor: 'var(--color-maroon-primary)' }}
              />
              Remember me
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset instructions sent."); }} style={{ color: 'var(--color-maroon-primary)', textDecoration: 'none', fontWeight: '500' }}>
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-gold" style={{ width: '100%' }}>
            <LogIn size={16} /> Sign In
          </button>
        </form>

        {/* Quick Admin Demo Link */}
        <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #eae3d9' }}>
          <button 
            type="button"
            onClick={() => setActiveTab('admin')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--color-text-muted)', 
              fontSize: '0.82rem', 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Shield size={13} color="var(--color-maroon-primary)" /> Switch directly to Admin Portal
          </button>
        </div>

        {/* Footer Toggle */}
        <div className="auth-footer-text">
          Don't have an account yet?
          <span className="auth-link" onClick={() => setActiveTab('signup')}>
            Register / Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}
