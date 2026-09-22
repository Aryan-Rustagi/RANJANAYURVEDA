const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

// Helper to get JWT token from localStorage
export const getAuthToken = () => localStorage.getItem('ayurveda_jwt_token');

// Helper to set JWT token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('ayurveda_jwt_token', token);
  } else {
    localStorage.removeItem('ayurveda_jwt_token');
  }
};

// Generic API fetcher with automatic JWT Authorization header
export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.warn(`API Fetch notice [${endpoint}]:`, error.message);
    throw error;
  }
};

// Auth Services
export const loginApi = async (credentials) => {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const registerApi = async (userData) => {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

// Appointment Services
export const fetchMyAppointmentsApi = async () => {
  return await apiFetch('/appointments/my');
};

export const bookAppointmentApi = async (apptData) => {
  return await apiFetch('/appointments', {
    method: 'POST',
    body: JSON.stringify(apptData)
  });
};

export const fetchAllAppointmentsApi = async () => {
  return await apiFetch('/appointments');
};

export const updateAppointmentStatusApi = async (id, status) => {
  return await apiFetch(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};

export const deleteAppointmentApi = async (id) => {
  return await apiFetch(`/appointments/${id}`, {
    method: 'DELETE'
  });
};

export const fetchPrescriptionsApi = async () => {
  return await apiFetch('/prescriptions/my');
};

export const requestRefillApi = async (medicineName) => {
  return await apiFetch('/prescriptions/refill', {
    method: 'POST',
    body: JSON.stringify({ medicineName })
  });
};
