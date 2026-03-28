'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'student' | 'tutor' | null;

interface User {
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('stalford_user');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === 'student@stalford.edu' && password === 'password123') {
      const user: User = {
        name: 'Itadori Yuji',
        email,
        role: 'student',
        avatar: 'IY',
      };
      setCurrentUser(user);
      localStorage.setItem('stalford_user', JSON.stringify(user));
      return true;
    }
    if (email === 'tutor@stalford.edu' && password === 'password123') {
      const user: User = {
        name: 'Gojo Satoru',
        email,
        role: 'tutor',
        avatar: 'GS',
      };
      setCurrentUser(user);
      localStorage.setItem('stalford_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('stalford_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
