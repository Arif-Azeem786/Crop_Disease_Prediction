import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');

    if (adminToken) {
      axios.get(API.adminVerify, { headers: { Authorization: `Bearer ${adminToken}` } })
        .then((res) => res.data?.valid && setAdminUser({ token: adminToken }))
        .catch(() => localStorage.removeItem('adminToken'))
        .finally(() => setLoading(false));
    } else if (userToken && userData) {
      setAppUser({ token: userToken, ...JSON.parse(userData) });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const adminLogin = async (username, password) => {
    const res = await axios.post(API.adminLogin, { username, password });
    if (res.data?.token) {
      localStorage.setItem('adminToken', res.data.token);
      setAdminUser({ token: res.data.token });
      setAppUser(null);
      return { success: true };
    }
    return { success: false };
  };

  const register = async (name, email, password, phone, location) => {
    const res = await axios.post(API.userRegister, { name, email, password, phone, location });
    if (res.data?.token && res.data?.user) {
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      setAppUser({ token: res.data.token, ...res.data.user });
      setAdminUser(null);
      return { success: true };
    }
    return { success: false };
  };

  const userLogin = async (email, password) => {
    const res = await axios.post(API.userLogin, { email, password });
    if (res.data?.token && res.data?.user) {
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      setAppUser({ token: res.data.token, ...res.data.user });
      setAdminUser(null);
      return { success: true };
    }
    return { success: false };
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setAdminUser(null);
    setAppUser(null);
  };

  const getToken = () => localStorage.getItem('adminToken') || localStorage.getItem('userToken');

  const isAdmin = !!adminUser;
  const isUser = !!appUser;
  const user = appUser || adminUser;

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isUser,
      loading,
      adminLogin,
      register,
      userLogin,
      logout,
      getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
