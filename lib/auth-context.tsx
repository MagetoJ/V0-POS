'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthSession } from './types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (employee_id: string, pin: string) => Promise<void>;
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

  const login = async (employee_id: string, pin: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id, pin }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    const apiUser = data.user;
    const token = data.token;
    
    // Maintain AuthSession structure with snake_case fields as defined in types.ts
    const session: AuthSession = {
      user: {
        id: apiUser.id || 0,
        employee_id: apiUser.employee_id,
        name: apiUser.name,
        role: apiUser.role,
        username: apiUser.username,
        pin: '', // Don't store PIN in session
        is_active: true,
        requires_clearing: false
      },
      token: token,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };

    localStorage.setItem('auth-session', JSON.stringify(session));
    localStorage.setItem('auth_token', token);
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
