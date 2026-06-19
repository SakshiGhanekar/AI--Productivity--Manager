import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const avatar = localStorage.getItem('avatar');
    if (token && email) {
      setUser({ name, email, avatar });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('auth/login', { email, password });
      const { token, name, email: userEmail } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('name', name || email);
      localStorage.setItem('email', userEmail || email);
      setUser({ name: name || email, email: userEmail || email });
      return { success: true };
    } catch (error) {
      console.error('Backend login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid email or password. If the backend restarted, your account may have been erased from the memory database. Please register again.' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('auth/register', { name, email, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
      setUser({ name, email });
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    setUser(null);
  };

  const updateProfile = (name) => {
    localStorage.setItem('name', name);
    setUser(prev => ({ ...prev, name }));
  };

  const updateAvatar = (avatarDataUrl) => {
    localStorage.setItem('avatar', avatarDataUrl);
    setUser(prev => ({ ...prev, avatar: avatarDataUrl }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    updateAvatar,
    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
