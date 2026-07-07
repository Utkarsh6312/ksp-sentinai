import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Check local storage for persistent session
    const storedUser = localStorage.getItem('sentinai_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('sentinai_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/server/sentinai_api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('sentinai_user', JSON.stringify(data.user));
        localStorage.setItem('sentinai_token', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid username or password' };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: 'Failed to connect to the server' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sentinai_user');
    localStorage.removeItem('sentinai_token');
  };

  if (loading) {
    return <div className="min-h-screen bg-ksp-navy flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuth: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
