import React, { useState, useEffect } from 'react';
import { Users, Search, Trash2, RefreshCw, MapPin, Phone, Mail, Heart } from 'lucide-react';
import { fetchAllPatients, deletePatientApi } from '../services/adminApi';

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPatients();
      if (data.patients) setPatients(data.patients);
    } catch (err) {
      console.warn('Patients load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPatients(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete patient "${name}"? This cannot be undone.`)) return;
    try {
      await deletePatientApi(id);
      setPatients(patients.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const filtered = patients.filter(p => {
    const q = searchQuery.toLowerCase();
    return (p.name || '').toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.phone || '').includes(q) ||
      (p.patientId || '').toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Patients</h1>
          <p>{patients.length} registered patients</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost btn-sm" onClick={loadPatients}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Dosha</th>
                <th>Branch</th>
                <th>Condition</th>
                <th>Registered</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                    Loading patients...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                    {searchQuery ? 'No patients match your search.' : 'No patients registered yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p._id}>
                    <td>
                      <span className="badge badge-branch" style={{ fontSize: '0.72rem' }}>
                        {p.patientId || '—'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>{p.name}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.84rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                          <Phone size={12} /> {p.phone || '—'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                          <Mail size={12} /> {p.email}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-yellow)' }}>
                        <Heart size={13} /> {p.dosha || '—'}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                        <MapPin size={13} color="var(--accent-purple)" /> {p.preferredBranch || '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '180px' }}>
                      {p.primaryCondition || '—'}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-red btn-sm"
                        onClick={() => handleDelete(p._id, p.name)}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
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
