import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ─── Local demo auth helpers (used when backend is offline) ─────────────────
const USERS_KEY = 'demo_users';

const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const makeDemoToken = (email) =>
  `demo_${btoa(email)}_${Date.now()}`;

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name  = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const avatar = localStorage.getItem('avatar');
    if (token && email) {
      setUser({ name, email, avatar });
    }
    setLoading(false);
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    // 1️⃣ Try real backend
    try {
      const response = await api.post('auth/register', { name, email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
      setUser({ name, email });
      return { success: true };
    } catch (backendError) {
      // Network error or 5xx → fall back to demo auth
      const isNetworkError = !backendError.response;
      const isServerError  = backendError.response?.status >= 500;

      if (isNetworkError || isServerError) {
        // 2️⃣ Demo / local fallback
        const users = getUsers();
        if (users.find((u) => u.email === email)) {
          return { success: false, message: 'Email already registered. Please sign in.' };
        }
        const newUser = { name, email, password };
        saveUsers([...users, newUser]);
        const token = makeDemoToken(email);
        localStorage.setItem('token', token);
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        setUser({ name, email });
        return { success: true };
      }

      // 4xx error from backend (e.g. duplicate email)
      return {
        success: false,
        message: backendError.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    // 1️⃣ Try real backend
    try {
      const response = await api.post('auth/login', { email, password });
      const { token, name, email: userEmail } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('name', name || email);
      localStorage.setItem('email', userEmail || email);
      setUser({ name: name || email, email: userEmail || email });
      return { success: true };
    } catch (backendError) {
      const isNetworkError = !backendError.response;
      const isServerError  = backendError.response?.status >= 500;

      if (isNetworkError || isServerError) {
        // 2️⃣ Demo / local fallback
        const users = getUsers();
        const found = users.find((u) => u.email === email && u.password === password);
        if (!found) {
          return { success: false, message: 'Invalid email or password.' };
        }
        const token = makeDemoToken(email);
        localStorage.setItem('token', token);
        localStorage.setItem('name', found.name);
        localStorage.setItem('email', found.email);
        setUser({ name: found.name, email: found.email });
        return { success: true };
      }

      return {
        success: false,
        message: backendError.response?.data?.message || 'Invalid email or password.',
      };
    }
  };

  // ── Logout / profile helpers ───────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    setUser(null);
  };

  const updateProfile = (name) => {
    localStorage.setItem('name', name);
    setUser((prev) => ({ ...prev, name }));
  };

  const updateAvatar = (avatarDataUrl) => {
    localStorage.setItem('avatar', avatarDataUrl);
    setUser((prev) => ({ ...prev, avatar: avatarDataUrl }));
  };

  const value = { user, login, register, logout, updateProfile, updateAvatar, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
