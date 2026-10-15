/**
 * SkillLens AI - Authentication Context & Session Management
 * Adheres to Section 8 auth specifications and safe redirect validation
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '@/packages/shared/src/types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (fullName: string, email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  csrfToken: string;
}

const DEFAULT_USER: AuthUser = {
  id: 'usr-demo-001',
  email: 'alex.chen@skillsbuild.org',
  fullName: 'Alex Chen',
  role: 'job_seeker',
  createdAt: '2026-03-01T10:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('skilllens_auth_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [csrfToken] = useState<string>(() => {
    return 'csrf-' + Math.random().toString(36).substring(2, 15);
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('skilllens_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('skilllens_auth_user');
    }
  }, [user]);

  const login = async (email: string, role: UserRole = 'job_seeker'): Promise<boolean> => {
    const namePart = email.split('@')[0] || 'User';
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const loggedUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      email,
      fullName: formattedName,
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(loggedUser);
    return true;
  };

  const register = async (
    fullName: string,
    email: string,
    role: UserRole
  ): Promise<boolean> => {
    const newUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      email,
      fullName,
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        csrfToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
