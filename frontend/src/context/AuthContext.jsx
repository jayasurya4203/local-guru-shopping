import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const AuthContext = createContext(null);

const AUTH_API = `${API_BASE_URL}/auth`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lg_auth_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('lg_auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const sendPhoneOTP = async (mobileNumber, emailAddress = '') => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/send-otp`, {
        mobile_number: mobileNumber,
        email: emailAddress
      });
      setLoading(false);
      return { success: true, data: res.data };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.response?.data?.error || 'Failed to send OTP' };
    }
  };

  const verifyPhoneOTP = async (mobileNumber, otpCode) => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/verify-otp`, {
        mobile_number: mobileNumber,
        otp: otpCode
      });
      setLoading(false);
      return { success: true, data: res.data };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.response?.data?.error || 'Invalid OTP code' };
    }
  };

  const sendEmailVerification = async (email) => {
    try {
      const res = await axios.post(`${AUTH_API}/send-email-verification`, { email });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to send verification email' };
    }
  };

  const loginUser = async (loginId, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/login`, {
        login_id: loginId,
        password: password
      });
      const { token, user: loggedUser } = res.data;
      setToken(token);
      setUser(loggedUser);
      localStorage.setItem('lg_auth_token', token);
      localStorage.setItem('lg_auth_user', JSON.stringify(loggedUser));
      setLoading(false);
      return { success: true, user: loggedUser };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const registerUser = async (fullName, email, mobile, password, isMobileVerified) => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/register`, {
        full_name: fullName,
        email: email,
        mobile_number: mobile,
        password: password,
        is_mobile_verified: isMobileVerified
      });
      const { token, user: newUser } = res.data;
      setToken(token);
      setUser(newUser);
      localStorage.setItem('lg_auth_token', token);
      localStorage.setItem('lg_auth_user', JSON.stringify(newUser));
      setLoading(false);
      return { success: true, user: newUser };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = async () => {
    if (user) {
      try {
        await axios.post(`${AUTH_API}/logout`, {
          user_id: user.id,
          user_email: user.email,
          user_name: user.full_name,
          role: user.role
        });
      } catch (e) {
        console.error("Logout notification error", e);
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('lg_auth_token');
    localStorage.removeItem('lg_auth_user');
  };

  const refreshUserProfile = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/me?user_id=${userId}`);
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('lg_auth_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (e) {
      console.error("Failed to refresh user profile", e);
    }
    return null;
  };

  const getUserAddresses = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/${userId}/addresses`);
      return res.data.addresses || [];
    } catch (e) {
      console.error("Failed to get addresses", e);
      return [];
    }
  };

  const addUserAddress = async (userId, addressData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/users/${userId}/addresses`, addressData);
      return { success: true, address: res.data.address };
    } catch (e) {
      return { success: false, error: e.response?.data?.error || 'Failed to save address' };
    }
  };

  const deleteUserAddress = async (addressId) => {
    try {
      await axios.delete(`${API_BASE_URL}/addresses/${addressId}`);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.error || 'Failed to delete address' };
    }
  };

  const setDefaultUserAddress = async (addressId) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/addresses/${addressId}/default`);
      return { success: true, address: res.data.address };
    } catch (e) {
      return { success: false, error: e.response?.data?.error || 'Failed to set default address' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        sendPhoneOTP,
        verifyPhoneOTP,
        sendEmailVerification,
        loginUser,
        registerUser,
        logout,
        refreshUserProfile,
        getUserAddresses,
        addUserAddress,
        deleteUserAddress,
        setDefaultUserAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
