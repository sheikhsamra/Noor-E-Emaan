import { createContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(() => {
    try {
      const s = localStorage.getItem('user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Sync fresh profile on mount (keeps wishlist / role up-to-date)
  useEffect(() => {
    if (!token) return;
    API.get('/auth/profile')
      .then(res => {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      })
      .catch(err => {
        if (err.response?.status === 401) logout();
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist token in axios header whenever it changes ──────────────────────
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // ── Auth actions ───────────────────────────────────────────────────────────

  /** Called after successful login OR email verification — receives { user, token } */
  const login = useCallback((data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('noor_cart');
    window.dispatchEvent(new CustomEvent('cart:clear'));
  }, []);

  /** Step 1 of email-first flow — check if email exists / verified */
  const checkEmail = useCallback(async (email) => {
    const res = await API.post('/auth/check-email', { email });
    return res.data.data; // { exists, provider?, isEmailVerified? }
  }, []);

  /** Signup — returns { success, message } (no JWT — user must verify email first) */
  const signup = useCallback(async ({ name, email, password, confirmPassword }) => {
    const res = await API.post('/auth/signup', { name, email, password, confirmPassword });
    return res.data;
  }, []);

  /** Verify OTP — returns { user, token } on success; calls login() internally */
  const verifyEmail = useCallback(async ({ email, otp }) => {
    const res = await API.post('/auth/verify-email', { email, otp });
    if (res.data.token) login(res.data);
    return res.data;
  }, [login]);

  /** Resend OTP */
  const resendVerificationOtp = useCallback(async (email) => {
    const res = await API.post('/auth/resend-verification-otp', { email });
    return res.data;
  }, []);

  /**
   * Google Sign-In — sends the Google access token to the backend.
   * Backend verifies it via Google's tokeninfo/userinfo endpoints, finds/creates
   * the user, and returns a Fazaljees JWT.
   * The raw Google access token is NEVER stored in localStorage.
   */
  const loginWithGoogle = useCallback(async (accessToken) => {
    const res = await API.post('/auth/google', { accessToken });
    if (res.data.token) login(res.data);
    return res.data;
  }, [login]);

  /** Send reset code — always returns generic success */
  const forgotPassword = useCallback(async (email) => {
    const res = await API.post('/auth/forgot-password', { email });
    return res.data;
  }, []);

  /**
   * Verify reset OTP — returns { data: { resetToken } } on success.
   * Caller stores resetToken in sessionStorage, never localStorage.
   */
  const verifyResetOtp = useCallback(async (email, otp) => {
    const res = await API.post('/auth/verify-reset-otp', { email, otp });
    return res.data;
  }, []);

  /** Resend reset OTP — returns generic success or 429 with waitSeconds */
  const resendResetOtp = useCallback(async (email) => {
    const res = await API.post('/auth/resend-reset-otp', { email });
    return res.data;
  }, []);

  /**
   * Reset password — sends the short-lived resetToken (from sessionStorage)
   * plus the new password. On success the caller must clear sessionStorage
   * and redirect to /login.
   */
  const resetPassword = useCallback(async ({ resetToken, newPassword, confirmPassword }) => {
    const res = await API.post('/auth/reset-password', { resetToken, newPassword, confirmPassword });
    return res.data;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      token,
      login,
      logout,
      checkEmail,
      signup,
      verifyEmail,
      resendVerificationOtp,
      loginWithGoogle,
      forgotPassword,
      verifyResetOtp,
      resendResetOtp,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
