'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthSession } from './types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const session = localStorage.getItem('auth-session');
    if (session) {
      try {
        const data: AuthSession = JSON.parse(session);
        // Check if session is still valid
        if (data.expiresAt > Date.now()) {
          setUser(data.user);
        } else {
          localStorage.removeItem('auth-session');
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('auth-session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (session: AuthSession) => {
    localStorage.setItem('auth-session', JSON.stringify(session));
    setUser(session.user);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth-session');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
