
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('constructguard_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('constructguard_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === 'demo@constructguard.ai' && password === 'demo123') {
      const userData = {
        email: email,
        name: 'Demo User',
        id: 'demo-user-001'
      };
      setUser(userData);
      localStorage.setItem('constructguard_user', JSON.stringify(userData));
      return { success: true };
    }
    
    const storedUsers = JSON.parse(localStorage.getItem('constructguard_users') || '[]');
    const foundUser = storedUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        email: foundUser.email,
        name: foundUser.name,
        id: foundUser.id
      };
      setUser(userData);
      localStorage.setItem('constructguard_user', JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (email, password, name) => {
    const storedUsers = JSON.parse(localStorage.getItem('constructguard_users') || '[]');
    
    if (storedUsers.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser = {
      email,
      password,
      name: name || email.split('@')[0],
      id: `user-${Date.now()}`
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('constructguard_users', JSON.stringify(storedUsers));
    
    const userData = {
      email: newUser.email,
      name: newUser.name,
      id: newUser.id
    };
    setUser(userData);
    localStorage.setItem('constructguard_user', JSON.stringify(userData));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('constructguard_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
