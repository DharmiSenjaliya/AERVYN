import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('aervyn_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('aervyn_token') || null);
  const [loading, setLoading] = useState(true);

  // Synchronize authentication status with backend
  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const res = await api.get('/user');
          const userData = res.data.user || res.data;
          setUser(userData);
          localStorage.setItem('aervyn_user', JSON.stringify(userData));
        } catch (err) {
          console.warn('Session verification notice:', err.message);
          // Don't wipe immediately if backend is starting up, but if 401 interceptor handles it
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, [token]);

  // Player & Admin Login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: authToken, user: userData } = res.data;
    
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('aervyn_token', authToken);
    localStorage.setItem('aervyn_user', JSON.stringify(userData));
    return userData;
  };

  // Player Registration
  const register = async (name, email, password, password_confirmation) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation
    });
    const { token: authToken, user: userData } = res.data;
    
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('aervyn_token', authToken);
    localStorage.setItem('aervyn_user', JSON.stringify(userData));
    return userData;
  };

  // Logout
  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (e) {
      // ignore network errors on logout
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('aervyn_token');
      localStorage.removeItem('aervyn_user');
    }
  };

  // Role Checks
  const isAdmin = user?.role === 'admin' || user?.role_id === 1 || user?.is_admin === true;
  const isPlayer = !!user && !isAdmin;

  const value = {
    user,
    token,
    loading,
    isAdmin,
    isPlayer,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
