import axios from 'axios';

/**
 * AERVYN Central API Service
 * Configured for Laravel Sanctum REST endpoints
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 15000
});

// Request interceptor: attach Sanctum Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aervyn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthenticated & normalize error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Determine user-friendly error message without technical leak
    let friendlyMessage = 'An unexpected spacetime disturbance occurred. Please retry.';

    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        friendlyMessage = 'Connection timed out while synchronizing with the temporal server.';
      } else {
        friendlyMessage = 'Unable to establish link with AERVYN central servers. Please check your connection.';
      }
    } else {
      const status = error.response.status;
      if (status === 401) {
        localStorage.removeItem('aervyn_token');
        localStorage.removeItem('aervyn_user');
        friendlyMessage = 'Session authorization has expired. Please log in again.';
      } else if (status === 403) {
        friendlyMessage = error.response.data?.message || 'Access restricted. Insufficient temporal clearance.';
      } else if (status === 429) {
        friendlyMessage = 'Transmission rate exceeded. Please pause briefly before dispatching further commands.';
      } else if (status === 422) {
        friendlyMessage = error.response.data?.message || 'The submitted telemetry contains invalid parameters.';
      } else if (status >= 500) {
        friendlyMessage = 'The central temporal mainframe experienced an internal anomaly. No progress was lost.';
      } else if (error.response.data?.message) {
        friendlyMessage = error.response.data.message;
      }
    }

    error.userFriendlyMessage = friendlyMessage;
    return Promise.reject(error);
  }
);

export default api;
