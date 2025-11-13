import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const response = await authAPI.getMe();
          // Backend returns user with 'id' field, convert to '_id' for consistency
          const user = response.data.user || response.data;
          const userWithId = { ...user, _id: user.id || user._id };
          setUser(userWithId);
          localStorage.setItem('user', JSON.stringify(userWithId));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;
    // Backend returns user with 'id' field, convert to '_id' for consistency
    const userWithId = { ...user, _id: user.id };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithId));
    setUser(userWithId);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await authAPI.register({ name, email, password });
    const { token, user } = response.data;
    // Backend returns user with 'id' field, convert to '_id' for consistency
    const userWithId = { ...user, _id: user.id };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithId));
    setUser(userWithId);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

