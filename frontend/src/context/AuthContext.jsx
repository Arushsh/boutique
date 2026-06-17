import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('boutique_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('boutique_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist token + user to localStorage
  useEffect(() => {
    if (token) localStorage.setItem('boutique_token', token);
    else localStorage.removeItem('boutique_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('boutique_user', JSON.stringify(user));
    else localStorage.removeItem('boutique_user');
  }, [user]);

  const clearError = () => setError(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (firstName, lastName, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { firstName, lastName, email, password });
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.error || 
                  err.response?.data?.errors?.[0]?.msg || 
                  'Registration failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user, token, loading, error,
      login, register, logout,
      isAdmin, isAuthenticated, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
