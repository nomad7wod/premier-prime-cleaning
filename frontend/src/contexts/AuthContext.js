import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
    } catch (err) {
      // If token is invalid, clear it
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setError('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, access_token } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', access_token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { user, access_token } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', access_token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};