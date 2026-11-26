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
    if (error.response?.status === 401) {
      localStorage.removeItem('aervyn_token');
      localStorage.removeItem('aervyn_user');
      // If not already on login/home, redirect
      if (!window.location.pathname.includes('/login')) {
        // preserve current path for redirection after login
      }
    }
    return Promise.reject(error);
  }
);

export default api;
