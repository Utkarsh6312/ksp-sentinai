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

  const MOCK_USERS = {
    admin: {
      id: 'USR_001',
      name: 'Inspector Rajkumar',
      role: 'Admin',
      email: 'rajkumar.admin@ksp.gov.in',
      station: 'Central Command',
      avatar: 'https://i.pravatar.cc/150?u=1'
    },
    investigator: {
      id: 'USR_002',
      name: 'Ravi Varma',
      role: 'Investigator',
      email: 'ravi.v@ksp.gov.in',
      station: 'South Division',
      avatar: 'https://i.pravatar.cc/150?u=2'
    }
  };

  const login = async (username, password, selectedRole) => {
    const u = (username || '').trim().toLowerCase();
    const p = (password || '').trim();

    // 1. Check built-in mock credentials first (always works, no network needed)
    if (MOCK_USERS[u] && p === u) {
      const mockUser = MOCK_USERS[u];
      if (selectedRole && mockUser.role.toLowerCase() !== selectedRole.toLowerCase()) {
        return { success: false, error: `Account exists, but it does not have ${selectedRole} privileges.` };
      }
      setCurrentUser(mockUser);
      localStorage.setItem('sentinai_user', JSON.stringify(mockUser));
      localStorage.setItem('sentinai_token', `mock_jwt_${u}_${Date.now()}`);
      
      await fetch('/api?route=audit_logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logTime: new Date().toLocaleString(),
          userName: mockUser.name || u,
          action: 'User Logged In (Mock)',
          ip: 'Client',
          status: 'Success'
        })
      }).catch(e => console.error(e));

      return { success: true };
    }

    // 2. Try Live API
    try {
      const response = await fetch('/api?route=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      });
      const data = await response.json();
      
      if (data.success) {
        if (selectedRole && data.user.role.toLowerCase() !== selectedRole.toLowerCase()) {
          return { success: false, error: `Account exists, but it does not have ${selectedRole} privileges.` };
        }
        setCurrentUser(data.user);
        localStorage.setItem('sentinai_user', JSON.stringify(data.user));
        localStorage.setItem('sentinai_token', data.token);

        await fetch('/api?route=audit_logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            logTime: new Date().toLocaleString(),
            userName: data.user.name || u,
            action: 'User Logged In',
            ip: 'Client',
            status: 'Success'
          })
        }).catch(e => console.error(e));

        return { success: true };
      } else {
        await fetch('/api?route=audit_logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            logTime: new Date().toLocaleString(),
            userName: u,
            action: 'Failed Login Attempt',
            ip: 'Client',
            status: 'Failed'
          })
        }).catch(e => console.error(e));
        
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Login failed due to network error' };
    }
  };

  const register = async (username, password, email, role) => {
    try {
      const u = (username || '').trim().toLowerCase();
      if (MOCK_USERS[u]) {
        return { success: false, error: 'Username already exists' };
      }

      const response = await fetch('/api?route=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: u, 
          password: password, 
          email: email, 
          role: role, 
          name: username, 
          division: 'General' 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Registration failed due to network error' };
    }
  };

  const logout = () => {
    if (currentUser) {
      fetch('/api?route=audit_logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logTime: new Date().toLocaleString(),
          userName: currentUser.name || 'System',
          action: 'User Logged Out',
          ip: 'Client',
          status: 'Success'
        })
      }).catch(e => console.error(e));
    }
    
    setCurrentUser(null);
    localStorage.removeItem('sentinai_user');
    localStorage.removeItem('sentinai_token');
  };

  if (loading) {
    return <div className="min-h-screen bg-ksp-navy flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isAuth: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
