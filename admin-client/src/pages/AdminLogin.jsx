import React, { useState } from 'react';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';
import { adminLoginApi } from '../services/adminApi';

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await adminLoginApi(form);
      if (data.admin) {
        onLogin(data.admin);
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div className="sidebar-logo-icon" style={{ width: '56px', height: '56px', fontSize: '1.3rem' }}>
            <Shield size={28} />
          </div>
        </div>
        <h1>Admin Login</h1>
        <p>Ranjan's Ayurveda Centre — Control Panel</p>

        {error && (
          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'var(--accent-red-bg)',
            border: '1px solid rgba(248,113,113,0.25)',
            color: 'var(--accent-red)',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Username
            </label>
            <input
              type="text"
              className="input"
              placeholder="admin"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Password
            </label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Default: admin / admin123
        </p>
      </div>
    </div>
  );
}
