import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('shopstream_user');
    const token = localStorage.getItem('shopstream_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    const { token, ...userData } = data;
    localStorage.setItem('shopstream_token', token);
    localStorage.setItem('shopstream_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistSession(data);
    toast.success(`Welcome back, ${data.name.split(' ')[0]}!`);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    persistSession(data);
    toast.success(`Welcome to ShopStream, ${data.name.split(' ')[0]}!`);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('shopstream_token');
    localStorage.removeItem('shopstream_user');
    setUser(null);
    toast.success('Signed out successfully');
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const { data } = await api.put('/auth/password', { currentPassword, newPassword });
    return data;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        changePassword,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
