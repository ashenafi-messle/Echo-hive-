import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount, check localStorage for user token
  useEffect(() => {
    const stored = localStorage.getItem('echohive_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
  }, []);

  // Login function: saves user + token to state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('echohive_user', JSON.stringify(userData));
  };

  // Logout function: clears state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('echohive_user');
  };

  // Helper: get token directly
  const getToken = () => user?.token || null;

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}
