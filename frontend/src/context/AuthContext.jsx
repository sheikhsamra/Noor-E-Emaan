import { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Fetch fresh profile to sync wishlist/likes
        if (token) {
          API.get('/auth/profile')
            .then(res => {
              setUser(res.data);
              localStorage.setItem('user', JSON.stringify(res.data));
            })
            .catch((err) => {
              // Only logout if token is actually invalid (401) — not on network errors
              if (err.response?.status === 401) logout();
            });
        }
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('noor_cart');
    window.dispatchEvent(new CustomEvent('cart:clear'));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
