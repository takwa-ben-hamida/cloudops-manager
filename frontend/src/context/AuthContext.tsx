'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, setToken, clearToken } from '@/lib/api';

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthToken(getToken());
  }, []);

  const login = (token: string) => {
    setToken(token);
    setAuthToken(token);
  };

  const logout = () => {
    clearToken();
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}