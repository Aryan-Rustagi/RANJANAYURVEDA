const API_BASE = (import.meta.env.VITE_ADMIN_API_URL || 'https://ranjan-admin-api.onrender.com/api/admin').replace(/\/+$/, '');

export const getAdminToken = () => localStorage.getItem('admin_jwt_token');

export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem('admin_jwt_token', token);
  } else {
    localStorage.removeItem('admin_jwt_token');
  }
};

const adminFetch = async (endpoint, options = {}) => {
  const token = getAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Admin API request failed');
  return data;
};

// Auth
export const adminLoginApi = async (credentials) => {
  const data = await adminFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  if (data.token) setAdminToken(data.token);
  return data;
};

// Stats
export const fetchDashboardStats = () => adminFetch('/appointments/stats');

// Patients
export const fetchAllPatients = () => adminFetch('/patients');
export const deletePatientApi = (id) => adminFetch(`/patients/${id}`, { method: 'DELETE' });

// Appointments
export const fetchAllAppointments = () => adminFetch('/appointments');
export const updateAppointmentStatus = (id, status) =>
  adminFetch(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const deleteAppointmentApi = (id) => adminFetch(`/appointments/${id}`, { method: 'DELETE' });
export const createWalkInAppointment = (data) =>
  adminFetch('/appointments', { method: 'POST', body: JSON.stringify(data) });
